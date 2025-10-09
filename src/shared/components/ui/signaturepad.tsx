import { useRef, useEffect, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const SignaturePad = () => {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 150 });

  useEffect(() => {
    const resizeCanvas = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setCanvasSize({ width, height: 150 });
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const clear = () => sigCanvas.current?.clear();

  const save = () => {
    const dataURL = sigCanvas.current?.toDataURL("image/png");
    if (dataURL) {
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "signature.png";
      link.click();
    }
  };

  return (
    <div ref={containerRef} className="w-full">
      <SignatureCanvas
        penColor="black"
        canvasProps={{
          width: canvasSize.width,
          height: canvasSize.height,
          className: "border border-gray-300 rounded w-full"
        }}
        ref={sigCanvas}
      />
      <div className="mt-2 flex gap-2 justify-end">
        <button
          onClick={clear}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear
        </button>
        <button
          onClick={save}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default SignaturePad;
