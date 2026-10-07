/* A browser demonstration of the native metronome, not a student recording.
   Native source: Core/Audio/Metronome.swift (40–240 BPM, subdivisions 1–4,
   recent 3s tap average, 1kHz / 30ms exponentially decaying click).
   Audio is created only by an explicit Play action and torn down on exit. */
(() => {
  'use strict';
  const tool = document.querySelector('#metronome-tool');
  const panel = document.querySelector('#metronome-demo');
  const tempo = document.querySelector('#tempo');
  const down = document.querySelector('#tempo-down');
  const up = document.querySelector('#tempo-up');
  const play = document.querySelector('#pulse-toggle');
  const status = document.querySelector('#pulse-status');
  const subdivisions = [...document.querySelectorAll('[data-subdivision]')];
  const light = document.querySelector('.beat-lights i');
  const deviceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let bpm = 72, subdivision = 1, running = false, tapTimes = [];
  let audio, output, click, subClick, scheduler, nextClick = 0, tickIndex = 0;
  let pulseAnimation;
  const sources = new Set(), displays = new Set();

  function sync() {
    tempo.value = String(bpm);
    down.disabled = bpm === 40;
    up.disabled = bpm === 240;
    play.textContent = running ? 'Stop metronome ■' : 'Play metronome ▶';
    play.setAttribute('aria-label', running ? 'Stop metronome' : 'Play metronome');
    play.setAttribute('aria-pressed', String(running));
    panel.dataset.running = String(running);
    subdivisions.forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.subdivision) === subdivision)));
  }
  function clearQueue() {
    clearInterval(scheduler);
    sources.forEach(source => { try { source.stop(); } catch {} });
    sources.clear();
    displays.forEach(clearTimeout);
    displays.clear();
    pulseAnimation?.cancel();
  }
  function stop() {
    const wasRunning = running;
    running = false;
    clearQueue();
    if (audio?.state === 'running') audio.suspend().catch(() => {});
    if (wasRunning) { status.textContent = 'Metronome stopped. Your tempo stays here.'; sync(); }
  }
  function makeClick(amplitude) {
    const buffer = audio.createBuffer(1, Math.round(audio.sampleRate * .03), audio.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < channel.length; i++) {
      const t = i / audio.sampleRate;
      channel[i] = Math.sin(2 * Math.PI * 1000 * t) * Math.exp(-t / .008) * amplitude;
    }
    return buffer;
  }
  function showBeat() {
    if (!running) return;
    panel.dataset.beat = String(Number(panel.dataset.beat || 0) + 1);
    if (deviceMotion.matches || document.documentElement.dataset.motion === 'reduce') return;
    pulseAnimation?.cancel();
    pulseAnimation = light.animate([{transform: 'scale(1)'}, {transform: 'scale(1.5)'}, {transform: 'scale(1)'}], {duration: 150, easing: 'ease-out'});
  }
  function schedule() {
    if (!running) return;
    // Drop missed clicks after a busy frame rather than playing a burst.
    if (nextClick < audio.currentTime - .02) nextClick = audio.currentTime + .025;
    while (nextClick < audio.currentTime + .1) {
      const isBeat = tickIndex++ % subdivision === 0;
      const source = audio.createBufferSource();
      source.buffer = isBeat ? click : subClick;
      source.connect(output);
      sources.add(source);
      source.onended = () => { sources.delete(source); source.disconnect(); };
      source.start(nextClick);
      if (isBeat) {
        const display = setTimeout(() => { displays.delete(display); showBeat(); }, Math.max(0, (nextClick - audio.currentTime) * 1000));
        displays.add(display);
      }
      nextClick += 60 / bpm / subdivision;
    }
  }
  function restart() {
    if (!running) return;
    clearQueue();
    tickIndex = 0;
    nextClick = audio.currentTime + .025;
    schedule();
    scheduler = setInterval(schedule, 25);
    status.textContent = `Playing at ${bpm} beats per minute. ${subdivision === 1 ? 'One click' : subdivision + ' clicks'} per beat.`;
  }
  function setTempo(value) {
    const parsed = Number(value);
    bpm = Number.isFinite(parsed) && parsed > 0 ? Math.max(40, Math.min(240, Math.round(parsed))) : bpm;
    sync();
    if (running) restart();
  }
  play.addEventListener('click', async () => {
    if (running) { stop(); return; }
    play.disabled = true;
    running = true;
    status.textContent = 'Starting the pulse…';
    let startDeadline;
    try {
      if (!audio) {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) throw new Error('Audio unavailable');
        audio = new Audio();
        audio.onstatechange = () => { if (!running && audio.state === 'running') audio.suspend().catch(() => {}); };
        output = audio.createGain();
        output.gain.value = .35;
        output.connect(audio.destination);
        click = makeClick(.5);
        subClick = makeClick(.18);
      }
      await Promise.race([audio.resume(), new Promise((_, reject) => { startDeadline = setTimeout(() => reject(new Error('Audio start timed out')), 3000); })]);
      if (!running || !tool.open || document.hidden) { stop(); return; }
      if (audio.state !== 'running') throw new Error('Audio did not start');
      sync();
      restart();
    } catch {
      running = false;
      clearQueue();
      sync();
      status.textContent = 'Sound couldn’t start in this browser. You can still set the tempo or try Play again.';
    } finally { clearTimeout(startDeadline); play.disabled = false; }
  });
  down.addEventListener('click', () => setTempo(bpm - 1));
  up.addEventListener('click', () => setTempo(bpm + 1));
  tempo.addEventListener('input', () => {
    const value = Number(tempo.value);
    if (tempo.value && Number.isInteger(value) && value >= 40 && value <= 240) {
      bpm = value; down.disabled = bpm === 40; up.disabled = bpm === 240; restart();
    }
  });
  tempo.addEventListener('change', () => setTempo(tempo.value));
  tempo.addEventListener('keydown', event => { if (event.key === 'Enter') { setTempo(tempo.value); tempo.blur(); } });
  subdivisions.forEach(button => button.addEventListener('click', () => { subdivision = Number(button.dataset.subdivision); sync(); restart(); }));
  document.querySelector('#tap-tempo').addEventListener('click', () => {
    const now = performance.now();
    tapTimes = tapTimes.filter(time => now - time < 3000);
    tapTimes.push(now);
    if (tapTimes.length < 2) { status.textContent = 'Tap again in time to set the tempo.'; return; }
    setTempo(60000 / ((now - tapTimes[0]) / (tapTimes.length - 1)));
    if (!running) status.textContent = `Tempo set to ${bpm} beats per minute. Press Play to hear it.`;
  });
  const respectMotion = () => { if (deviceMotion.matches || document.documentElement.dataset.motion === 'reduce') pulseAnimation?.cancel(); };
  deviceMotion.addEventListener('change', respectMotion);
  document.addEventListener('prova:motionchange', respectMotion);
  tool.addEventListener('toggle', () => { if (!tool.open) stop(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  window.addEventListener('pagehide', stop);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { if (!entries[0].isIntersecting) stop(); }, {threshold: .1}).observe(panel);
  sync();
})();
