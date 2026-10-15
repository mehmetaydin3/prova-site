import json,struct,zlib,pathlib
root=pathlib.Path('/private/tmp/prova-motion-v2-frames')
frames=json.loads((root/'frames.json').read_text())
def chunk(kind,data):
 return struct.pack('>I',len(data))+kind+data+struct.pack('>I',zlib.crc32(kind+data)&0xffffffff)
def read_png(path):
 raw=pathlib.Path(path).read_bytes();at=8;parts=[];ihdr=None
 while at<len(raw):
  size=struct.unpack('>I',raw[at:at+4])[0];kind=raw[at+4:at+8];data=raw[at+8:at+8+size];at+=12+size
  if kind==b'IHDR':ihdr=data
  if kind==b'IDAT':parts.append(data)
 return ihdr,b''.join(parts)
ihdr,_=read_png(frames[0]['file']);w,h=struct.unpack('>II',ihdr[:8]);out=bytearray(b'\x89PNG\r\n\x1a\n');out+=chunk(b'IHDR',ihdr);out+=chunk(b'acTL',struct.pack('>II',len(frames),0));seq=0
for i,f in enumerate(frames):
 hdr,data=read_png(f['file']);assert hdr==ihdr
 duration=min(60000,f['duration'])
 out+=chunk(b'fcTL',struct.pack('>IIIIIHHBB',seq,w,h,0,0,duration,1000,0,0));seq+=1
 if i==0:out+=chunk(b'IDAT',data)
 else:out+=chunk(b'fdAT',struct.pack('>I',seq)+data);seq+=1
out+=chunk(b'IEND',b'');target=pathlib.Path('review/cinematic-v2/motion-preview.apng');target.write_bytes(out)
print(f'Encoded {len(frames)} real browser frames: {w}x{h}, {len(out)//1024} KiB, {sum(f["duration"] for f in frames)/1000:.1f}s')
