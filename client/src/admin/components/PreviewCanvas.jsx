import React, { useState, useRef, useEffect } from 'react';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Crosshair, 
  RotateCw, 
  ExternalLink, 
  Maximize2, 
  Minimize2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

export default function PreviewCanvas({
  iframeRef,
  previewDevice,
  setPreviewDevice,
  zoomLevel,
  setZoomLevel,
  isInspectMode,
  setIsInspectMode,
  onIframeLoad,
  onRefresh
}) {
  const [isLandscape, setIsLandscape] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const bodyRef = useRef(null);
  const [desktopScale, setDesktopScale] = useState(1);
  const [availDim, setAvailDim] = useState({ w: 1000, h: 700 });

  // Compute natural dimensions and scaling so the preview expands to full available width
  useEffect(() => {
    const compute = () => {
      if (bodyRef.current) {
        const availW = Math.max(320, bodyRef.current.clientWidth);
        const availH = Math.max(320, bodyRef.current.clientHeight);
        setAvailDim({ w: availW, h: availH });

        if (previewDevice === 'desktop') {
          const scale = availW / 1280;
          setDesktopScale(scale);
        } else {
          const targetW = DEVICE_WIDTHS[previewDevice] || 768;
          const targetH = isLandscape ? 520 : 720;
          const scaleW = availW / targetW;
          const scaleH = (availH - 32) / targetH;
          setDesktopScale(Math.min(1, scaleW, scaleH));
        }
      }
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (bodyRef.current) ro.observe(bodyRef.current);
    return () => ro.disconnect();
  }, [previewDevice, isFullscreen, isLandscape, zoomLevel]);

  // Device intrinsic widths
  const DEVICE_WIDTHS = {
    desktop: 1280,
    tablet: isLandscape ? 1024 : 768,
    mobileL: isLandscape ? 740 : 425,
    mobileS: isLandscape ? 667 : 375,
  };

  const getIframeWidth = () => {
    const w = DEVICE_WIDTHS[previewDevice] || 1280;
    return `${w}px`;
  };

  // For zoom adjustments
  const getUserScale = () => {
    if (zoomLevel === 50) return 0.5;
    if (zoomLevel === 75) return 0.75;
    if (zoomLevel === 125) return 1.25;
    return 1.0;
  };

  const getWrapperStyle = () => {
    if (previewDevice === 'desktop') {
      return {
        width: '100%',
        height: '100%',
        maxWidth: '100%',
        maxHeight: '100%',
        transform: 'none',
      };
    }

    const targetW = DEVICE_WIDTHS[previewDevice] || 768;
    const targetH = isLandscape ? 520 : 720;
    const boxedScale = desktopScale * getUserScale();
    return {
      width: `${targetW}px`,
      height: `${targetH}px`,
      transform: `scale(${boxedScale.toFixed(3)})`,
      transformOrigin: 'center center',
      flexShrink: 0,
    };
  };

  const getIframeStyle = () => {
    const userScale = getUserScale();
    if (previewDevice === 'desktop') {
      const scale = (availDim.w / 1280) * userScale;
      const availableIframeHeight = Math.max(300, availDim.h - 32);
      const virtualIframeHeight = Math.round(availableIframeHeight / Math.max(0.01, scale));
      return {
        width: '1280px',
        height: `${virtualIframeHeight}px`,
        transform: `scale(${scale.toFixed(4)})`,
        transformOrigin: 'top left',
        border: 'none',
        background: '#faf8f5',
        display: 'block',
      };
    }

    return {
      width: '100%',
      height: '100%',
      border: 'none',
      background: '#faf8f5',
      display: 'block',
    };
  };

  const isBoxed = previewDevice !== 'desktop';

  return (
    <div className={`cms-canvas-viewport ${isFullscreen ? 'cms-canvas-fullscreen' : ''}`}>
      {/* Canvas Top Bar */}
      <div className="cms-canvas-topbar">
        {/* Device Switcher */}
        <div className="cms-device-group" role="group" aria-label="Device Viewport">
          <button
            type="button"
            className={`cms-device-btn ${previewDevice === 'desktop' ? 'active' : ''}`}
            onClick={() => setPreviewDevice('desktop')}
            title="Desktop View (1280px, scaled to fit)"
          >
            <Monitor size={15} />
            <span>Desktop</span>
          </button>
          <button
            type="button"
            className={`cms-device-btn ${previewDevice === 'tablet' ? 'active' : ''}`}
            onClick={() => setPreviewDevice('tablet')}
            title="Tablet View (768px)"
          >
            <Tablet size={15} />
            <span>Tablet</span>
          </button>
          <button
            type="button"
            className={`cms-device-btn ${previewDevice === 'mobileL' ? 'active' : ''}`}
            onClick={() => setPreviewDevice('mobileL')}
            title="Mobile Large (425px)"
          >
            <Smartphone size={15} />
            <span>Mobile L</span>
          </button>
          <button
            type="button"
            className={`cms-device-btn ${previewDevice === 'mobileS' ? 'active' : ''}`}
            onClick={() => setPreviewDevice('mobileS')}
            title="Mobile Standard (375px)"
          >
            <Smartphone size={13} />
            <span>Mobile</span>
          </button>
        </div>

        {/* Center / Inspect Mode Toggle */}
        <div className="cms-canvas-center-acts">
          <button
            type="button"
            className={`cms-inspect-toggle ${isInspectMode ? 'active' : ''}`}
            onClick={() => setIsInspectMode(!isInspectMode)}
            title={isInspectMode ? "Inspect Mode Active: Double-click preview elements to jump directly to form" : "Click to enable Visual Click-to-Edit mode"}
          >
            <Crosshair size={14} className={isInspectMode ? 'spin-slow' : ''} />
            <span>{isInspectMode ? 'Inspector Active' : 'Inspector Off'}</span>
          </button>

          {(previewDevice === 'tablet' || previewDevice === 'mobileL' || previewDevice === 'mobileS') && (
            <button
              type="button"
              className={`cms-canvas-btn ${isLandscape ? 'active' : ''}`}
              onClick={() => setIsLandscape(!isLandscape)}
              title="Flip Orientation (Portrait / Landscape)"
            >
              <span>{isLandscape ? 'Landscape' : 'Portrait'}</span>
            </button>
          )}
        </div>

        {/* Right Zoom & View Controls */}
        <div className="cms-canvas-right-acts">
          <div className="cms-zoom-group">
            <button
              type="button"
              className="cms-canvas-icon-btn"
              onClick={() => setZoomLevel(prev => (prev === 50 ? 50 : prev === 75 ? 50 : prev === 100 ? 75 : 100))}
              title="Zoom Out"
            >
              <ZoomOut size={13} />
            </button>
            <span className="cms-zoom-label">{zoomLevel}%</span>
            <button
              type="button"
              className="cms-canvas-icon-btn"
              onClick={() => setZoomLevel(prev => (prev === 125 ? 125 : prev === 100 ? 125 : prev === 75 ? 100 : 75))}
              title="Zoom In"
            >
              <ZoomIn size={13} />
            </button>
          </div>

          <button
            type="button"
            className="cms-canvas-icon-btn"
            onClick={onRefresh}
            title="Reload Preview"
          >
            <RotateCw size={14} />
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="cms-canvas-icon-btn"
            title="Open Storefront in New Tab"
          >
            <ExternalLink size={14} />
          </a>

          <button
            type="button"
            className="cms-canvas-icon-btn"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="cms-canvas-body" ref={bodyRef}>
        <div
          className={`cms-frame-wrapper ${isBoxed ? 'cms-frame-boxed' : 'cms-frame-desktop'}`}
          style={getWrapperStyle()}
        >
          {/* Mock Browser Header */}
          <div className="cms-mock-chrome">
            <div className="cms-mock-dots">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </div>
            <div className="cms-mock-url">
              <span className="lock">🔒</span>
              <span className="domain">chandrakanta.in</span>
              {previewDevice !== 'desktop' && (
                <span style={{ color: '#71717a', fontSize: '10px' }}>
                  — {DEVICE_WIDTHS[previewDevice]}px {isLandscape ? 'landscape' : 'portrait'}
                </span>
              )}
              {previewDevice === 'desktop' && (
                <span style={{ color: '#71717a', fontSize: '10px' }}>
                  — 1280px Desktop Widescreen · {Math.round((availDim.w / 1280) * getUserScale() * 100)}% scale
                </span>
              )}
            </div>
            <div className="cms-mock-badge">
              LIVE PREVIEW
            </div>
          </div>

          {/* Iframe Root inside full-bleed container */}
          <div className="cms-iframe-container">
            <iframe
              ref={iframeRef}
              src="/"
              title="Chandrakanta Live Preview"
              className="cms-preview-frame"
              onLoad={onIframeLoad}
              style={getIframeStyle()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
