from pathlib import Path
import struct,zlib
root=Path(__file__).resolve().parents[2]
def chunk(kind,data):
 return struct.pack('>I',len(data))+kind+data+struct.pack('>I',zlib.crc32(kind+data)&0xffffffff)
def png(path):
 raw=path.read_bytes();at=8;parts=[];hdr=None
 while at<len(raw):
  size=struct.unpack('>I',raw[at:at+4])[0];kind=raw[at+4:at+8];data=raw[at+8:at+8+size];at+=12+size
  if kind==b'IHDR':hdr=data
  if kind==b'IDAT':parts.append(data)
 return hdr,b''.join(parts)
for direction in ['a','b']:
 frames=sorted((root/f'review/v9/frames-{direction}').glob('*.png'))
 assert len(frames)==36
 hdr,_=png(frames[0]);w,h=struct.unpack('>II',hdr[:8]);out=bytearray(b'\x89PNG\r\n\x1a\n');out+=chunk(b'IHDR',hdr);out+=chunk(b'acTL',struct.pack('>II',len(frames),0));seq=0
 for i,f in enumerate(frames):
  ihdr,data=png(f);assert ihdr==hdr
  duration=900 if i in [0,35] else 110
  out+=chunk(b'fcTL',struct.pack('>IIIIIHHBB',seq,w,h,0,0,duration,1000,0,0));seq+=1
  if i==0:out+=chunk(b'IDAT',data)
  else:out+=chunk(b'fdAT',struct.pack('>I',seq)+data);seq+=1
 out+=chunk(b'IEND',b'');(root/f'review/v9/{direction}-motion.png').write_bytes(out)
 print(direction,len(out)//1024,'KiB')
