import { useRef, useState } from 'react';
import { ZoomIn } from 'lucide-react';

export default function ProductGallery({ images, name }) {
  const [active, setActive] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({});
  const [zooming, setZooming] = useState(false);
  const frameRef = useRef(null);

  const onMouseMove = (e) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%` });
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-4">
      <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible no-scrollbar">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`shrink-0 w-16 h-20 sm:w-20 sm:h-24 overflow-hidden border-2 ${active === i ? 'border-gold' : 'border-transparent'}`}
          >
            <img src={img} alt={`${name} view ${i + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      <div
        ref={frameRef}
        className="relative flex-1 aspect-[3/4] overflow-hidden bg-stone/10 cursor-zoom-in"
        onMouseEnter={() => setZooming(true)}
        onMouseLeave={() => setZooming(false)}
        onMouseMove={onMouseMove}
      >
        <img
          src={images[active]}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-200"
          style={zooming ? { transform: 'scale(1.9)', ...zoomStyle } : {}}
        />
        <span className="absolute bottom-3 right-3 bg-white/90 p-2 pointer-events-none">
          <ZoomIn size={16} className="text-charcoal" />
        </span>
      </div>
    </div>
  );
}
