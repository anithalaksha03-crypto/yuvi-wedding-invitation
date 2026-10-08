'use client';

import React, { useEffect, useRef, useState } from 'react';

export type InviteData = {
  bride: string;
  groom: string;
  date: string;
  time: string;
  venue: string;
  family: string;
  reception: string;
  message: string;
  groomPhoto: string;
  bridePhoto: string;
  couplePhoto: string;
  card: string;
  gallery: string[];
  music: string;
  musicName: string;
  theme: 'royal' | 'emerald' | 'blush';
};

const initial: InviteData = {
  bride: 'Anitha',
  groom: 'Yuvaraj',
  date: '16 September 2026',
  time: '11:00 AM',
  venue: 'MGR Mandapam, Pothanur',
  family: 'Together with their families',
  reception: 'Reception • 16 September • 6:00 PM',
  message:
    'Two hearts, one beautiful journey. We would be delighted to celebrate this special day with you.',
  groomPhoto: '',
  bridePhoto: '',
  couplePhoto: '',
  card: '',
  gallery: [],
  music: '',
  musicName: '',
  theme: 'emerald',
};

function fileData(file: File, cb: (value: string) => void) {
  const reader = new FileReader();

  reader.onload = () => {
    cb(String(reader.result));
  };

  reader.readAsDataURL(file);
}

export default function Home() {
  const [d, setD] = useState<InviteData>(initial);
  const [open, setOpen] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const update = <K extends keyof InviteData>(
    key: K,
    value: InviteData[K]
  ) => {
    setD((old) => ({
      ...old,
      [key]: value,
    }));
  };

  const setImage = (key: keyof InviteData, file?: File) => {
    if (!file) return;

    fileData(file, (value) => {
      update(key, value as InviteData[typeof key]);
    });
  };

  const addGallery = (files: FileList | null) => {
    if (!files) return;

    const selected = Array.from(files).slice(0, 12);

    Promise.all(
      selected.map(
        (file) =>
          new Promise<string>((resolve) => {
            fileData(file, resolve);
          })
      )
    ).then((images) => {
      setD((old) => ({
        ...old,
        gallery: images.slice(0, 12),
      }));
    });
  };

  useEffect(() => {
    if (!audioRef.current) return;

    if (musicOn && d.music) {
      audioRef.current.volume = 0.65;
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [musicOn, d.music]);

  const reset = () => {
    setD(initial);
    setOpen(false);
    setMusicOn(false);
  };

  return (
    <main className="builder">
      <header className="topbar">
        <b>YUVI STUDIO</b>
        <span> Wedding E-Invitation Creator</span>
        <span className="badge">GRAND CINEMATIC • 9:16</span>
      </header>

      <div className="builderGrid">
        <section className="editor-panel">
          <h1>Create your invitation</h1>

          <p className="hint">
            Fill the details once. Your premium cinematic invitation updates
            instantly on the right.
          </p>

          <div className="sectionTitle">Couple</div>

          <div className="fields">
            <Field
              label="Groom name"
              value={d.groom}
              onChange={(v) => update('groom', v)}
            />

            <Field
              label="Bride name"
              value={d.bride}
              onChange={(v) => update('bride', v)}
            />

            <Upload
              label="Groom photo"
              onFile={(f) => setImage('groomPhoto', f)}
            />

            <Upload
              label="Bride photo"
              onFile={(f) => setImage('bridePhoto', f)}
            />

            <Upload
              label="Couple photo"
              onFile={(f) => setImage('couplePhoto', f)}
            />

            <Upload
              label="Invitation card"
              onFile={(f) => setImage('card', f)}
            />
          </div>

          <div className="sectionTitle">Wedding details</div>

          <div className="fields">
            <Field
              label="Wedding date"
              value={d.date}
              onChange={(v) => update('date', v)}
            />

            <Field
              label="Wedding time"
              value={d.time}
              onChange={(v) => update('time', v)}
            />

            <Field
              label="Venue"
              value={d.venue}
              onChange={(v) => update('venue', v)}
            />

            <Field
              label="Family line"
              value={d.family}
              onChange={(v) => update('family', v)}
            />

            <Field
              label="Reception"
              value={d.reception}
              onChange={(v) => update('reception', v)}
            />

            <Field
              label="Invitation message"
              value={d.message}
              onChange={(v) => update('message', v)}
            />
          </div>

          <div className="sectionTitle">Style & media</div>

          <div className="themeRow">
            {(['emerald', 'royal', 'blush'] as const).map((theme) => (
              <button
                key={theme}
                type="button"
                className={`themeBtn ${
                  d.theme === theme ? 'selected' : ''
                }`}
                onClick={() => update('theme', theme)}
              >
                {theme === 'emerald'
                  ? 'Emerald'
                  : theme === 'royal'
                  ? 'Royal'
                  : 'Blush'}
              </button>
            ))}
          </div>

          <div style={{ height: 12 }} />

          <Upload
            label="Background music (MP3 / WAV)"
            accept="audio/*"
            onFile={(file) => {
              if (!file) return;

              fileData(file, (value) => {
                setD((old) => ({
                  ...old,
                  music: value,
                  musicName: file.name,
                }));
              });
            }}
          />

          {d.musicName && (
            <p className="note">Music selected: {d.musicName}</p>
          )}

          <Upload
            label="Our memories — up to 12 photos"
            accept="image/*"
            multiple
            onFiles={addGallery}
          />

          {d.gallery.length > 0 && (
            <div className="thumbs">
              {d.gallery.map((src, index) => (
                <img key={index} src={src} alt={`Memory ${index + 1}`} />
              ))}
            </div>
          )}

          <div className="actions">
            <button
              type="button"
              onClick={() => setOpen(true)}
            >
              Open Grand Invitation
            </button>

            <button
              type="button"
              className="ghost"
              onClick={reset}
            >
              Reset
            </button>
          </div>

          <p className="note">
            Your invitation is ready as a premium interactive experience.
            MP4 video rendering will be added as the next production stage.
          </p>
        </section>

        <section className="preview-panel">
          <div className="previewHead">
            <div>
              <h2>Live Preview</h2>
              <p className="note">9:16 • Premium cinematic style</p>
            </div>

            <button
              type="button"
              onClick={() => setOpen(true)}
            >
              Full screen
            </button>
          </div>

          <Invitation
            data={d}
            themeClass={d.theme}
          />
        </section>
      </div>

      {d.music && (
        <audio
          ref={audioRef}
          src={d.music}
          loop
          preload="auto"
        />
      )}

      {open && (
        <div className="modal">
          <div className="modalTop">
              <Invitation
              data={d}
              themeClass={d.theme}
              full
            />
          </div>
        </div>
      )}
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Upload({
  label,
  onFile,
  onFiles,
  accept = 'image/*',
  multiple = false,
}: {
  label: string;
  onFile?: (file?: File) => void;
  onFiles?: (files: FileList | null) => void;
  accept?: string;
  multiple?: boolean;
}) {
  return (
    <label className="upload">
      <span>{label}</span>

      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          if (multiple) {
            onFiles?.(e.target.files);
          } else {
            onFile?.(e.target.files?.[0]);
          }
        }}
      />
    </label>
  );
}

function Invitation({
  data,
  themeClass,
  full = false,
}: {
  data: InviteData;
  themeClass: string;
  full?: boolean;
}) {
  return (
    <div
      className={`inviteShell ${themeClass} ${full ? 'full' : ''}`}
      style={{
        background: '#061c19',
        color: '#f4db8b',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .yuviCinematic {
          scroll-behavior: smooth;
          scroll-snap-type: y mandatory;
        }

        .yuviScene {
          min-height: 100vh;
          scroll-snap-align: start;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 50px 24px;
          box-sizing: border-box;
          background:
            radial-gradient(circle at 50% 35%, rgba(212,175,55,.12), transparent 32%),
            linear-gradient(145deg,#061c19,#0a2923 48%,#031310);
        }

        .yuviScene::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(circle at 15% 20%, rgba(255,215,120,.16) 0 1px, transparent 2px),
            radial-gradient(circle at 82% 30%, rgba(255,215,120,.13) 0 1px, transparent 2px),
            radial-gradient(circle at 28% 78%, rgba(255,215,120,.12) 0 1px, transparent 2px),
            radial-gradient(circle at 72% 82%, rgba(255,215,120,.15) 0 1px, transparent 2px);
          background-size: 150px 150px, 190px 190px, 170px 170px, 210px 210px;
          opacity: .75;
        }

        .yuviGlow {
          position: absolute;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: rgba(212,175,55,.14);
          filter: blur(65px);
          left: 50%;
          top: 38%;
          transform: translate(-50%,-50%);
          animation: yuviGlow 5s ease-in-out infinite;
          pointer-events: none;
        }

        .yuviSweep {
          position: absolute;
          top: -20%;
          left: -45%;
          width: 38%;
          height: 140%;
          transform: skewX(-18deg);
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,215,120,.05),
              rgba(255,240,190,.35),
              rgba(255,215,120,.08),
              transparent
            );
          animation: yuviSweep 6s ease-in-out infinite;
          pointer-events: none;
        }

        .yuviFade {
          animation: yuviFade 1.8s ease both;
        }

        .yuviZoom {
          animation: yuviZoom 7s ease-in-out infinite;
        }

        .yuviPhoto {
          width: min(78vw, 330px);
          height: min(55vh, 390px);
          object-fit: cover;
          border: 1px solid rgba(244,219,139,.55);
          border-radius: 160px 160px 24px 24px;
          box-shadow:
            0 0 0 8px rgba(212,175,55,.035),
            0 25px 70px rgba(0,0,0,.55);
          display: block;
        }

        .yuviSmallPhoto {
          width: 125px;
          height: 155px;
          object-fit: cover;
          border-radius: 75px 75px 18px 18px;
          border: 1px solid rgba(244,219,139,.5);
          box-shadow: 0 18px 45px rgba(0,0,0,.45);
        }

        .yuviEyebrow {
          color: #d8af45;
          font-size: 11px;
          letter-spacing: .32em;
          text-transform: uppercase;
          position: relative;
          z-index: 2;
        }

        .yuviTitle {
          position: relative;
          z-index: 2;
          margin: 18px 0;
          color: #f4db8b;
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: clamp(34px, 9vw, 62px);
          font-weight: 400;
          line-height: 1.02;
        }

        .yuviText {
          position: relative;
          z-index: 2;
          max-width: 500px;
          color: #bdb5a1;
          font-size: 13px;
          line-height: 1.8;
        }

        .yuviGoldLine {
          width: 80px;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            #d8af45,
            transparent
          );
          margin: 18px auto;
          position: relative;
          z-index: 2;
        }

        .yuviName {
          color: #f4db8b;
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: clamp(30px, 8vw, 48px);
          line-height: 1;
        }

        .yuviAmp {
          color: #d8af45;
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: 28px;
          font-style: italic;
          margin: 12px 0;
        }

        .yuviCard {
          position: relative;
          z-index: 2;
          width: min(88vw, 430px);
          padding: 16px;
          border: 1px solid rgba(216,175,69,.45);
          background: rgba(255,255,255,.025);
          box-shadow: 0 25px 80px rgba(0,0,0,.5);
          backdrop-filter: blur(5px);
        }

        .yuviCard img {
          width: 100%;
          max-height: 62vh;
          object-fit: contain;
          display: block;
        }

        .yuviInfoBox {
          position: relative;
          z-index: 2;
          width: min(88vw, 430px);
          padding: 28px 22px;
          border: 1px solid rgba(216,175,69,.3);
          background: linear-gradient(
            145deg,
            rgba(255,255,255,.045),
            rgba(255,255,255,.015)
          );
          box-shadow: 0 25px 70px rgba(0,0,0,.35);
        }

        .yuviInfoRow {
          padding: 15px 0;
          border-bottom: 1px solid rgba(216,175,69,.15);
        }

        .yuviInfoRow:last-child {
          border-bottom: 0;
        }

        .yuviLabel {
          display: block;
          color: #9d957f;
          font-size: 9px;
          letter-spacing: .2em;
          text-transform: uppercase;
          margin-bottom: 7px;
        }

        .yuviValue {
          color: #f4db8b;
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: 23px;
        }

        .yuviMemory {
          width: min(86vw, 390px);
          height: min(58vh, 420px);
          object-fit: cover;
          border: 1px solid rgba(216,175,69,.4);
          box-shadow: 0 25px 70px rgba(0,0,0,.5);
          animation: memoryZoom 8s ease-in-out infinite;
        }

        .yuviMemoryGrid {
          position: relative;
          z-index: 2;
          width: min(90vw, 500px);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .yuviMemoryGrid img {
          width: 100%;
          height: 190px;
          object-fit: cover;
          border: 1px solid rgba(216,175,69,.3);
          animation: memoryFade 7s ease-in-out infinite;
        }

        .yuviButton {
          position: relative;
          z-index: 2;
          margin-top: 25px;
          padding: 13px 25px;
          border: 1px solid rgba(244,219,139,.5);
          background: rgba(216,175,69,.08);
          color: #f4db8b;
          letter-spacing: .18em;
          font-size: 10px;
          text-transform: uppercase;
        }

        @keyframes yuviGlow {
          0%,100% {
            transform: translate(-50%,-50%) scale(.82);
            opacity: .35;
          }
          50% {
            transform: translate(-50%,-50%) scale(1.2);
            opacity: .9;
          }
        }

        @keyframes yuviSweep {
          0% {
            left: -45%;
            opacity: 0;
          }
          15% {
            opacity: .8;
          }
          58% {
            left: 110%;
            opacity: .85;
          }
          100% {
            left: 110%;
            opacity: 0;
          }
        }

        @keyframes yuviFade {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes yuviZoom {
          0%,100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.035);
          }
        }

        @keyframes memoryZoom {
          0%,100% {
            transform: scale(1.03);
          }
          50% {
            transform: scale(1);
          }
        }

        @keyframes memoryFade {
          0%,100% {
            opacity: .72;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>

      <div className="yuviCinematic">

        {/* SCENE 1 — GRAND OPENING */}
        <section className="yuviScene">
          <div className="yuviGlow" />
          <div className="yuviSweep" />

          <div className="yuviFade" style={{ position: 'relative', zIndex: 2 }}>
            <div className="yuviEyebrow">
              A BEAUTIFUL BEGINNING
            </div>

            <div className="yuviGoldLine" />

            <div
              style={{
                color: '#f4db8b',
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontSize: 14,
                letterSpacing: '.42em',
                marginLeft: '.42em',
              }}
            >
              YUVI STUDIO
            </div>

            <div
              style={{
                color: '#9d957f',
                fontSize: 9,
                letterSpacing: '.3em',
                marginTop: 12,
              }}
            >
              PRESENTS
            </div>

            <div
              style={{
                marginTop: 35,
                color: '#d8af45',
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontSize: 22,
                fontStyle: 'italic',
              }}
            >
              The Beginning of Forever
            </div>
          </div>
        </section>

        {/* SCENE 2 — COUPLE INTRODUCTION */}
        <section className="yuviScene">
          <div className="yuviEyebrow">
            TOGETHER WITH THEIR FAMILIES
          </div>

          <div className="yuviGoldLine" />

          <h2 className="yuviTitle">
            Two Hearts,
            <br />
            One Beautiful Journey
          </h2>

          <div
            style={{
              position: 'relative',
              zIndex: 2,
              marginTop: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
              flexWrap: 'wrap',
            }}
          >
            {data.groomPhoto ? (
              <img
                src={data.groomPhoto}
                alt={data.groom}
                className="yuviSmallPhoto"
              />
            ) : (
              <div
                className="yuviSmallPhoto"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#8f8775',
                  fontSize: 9,
                }}
              >
                GROOM
              </div>
            )}

            <div className="yuviAmp">&</div>

            {data.bridePhoto ? (
              <img
                src={data.bridePhoto}
                alt={data.bride}
                className="yuviSmallPhoto"
              />
            ) : (
              <div
                className="yuviSmallPhoto"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#8f8775',
                  fontSize: 9,
                }}
              >
                BRIDE
              </div>
            )}
          </div>

          <div
            style={{
              position: 'relative',
              zIndex: 2,
              marginTop: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 18,
            }}
          >
            <span className="yuviName">{data.groom}</span>
            <span className="yuviAmp">&</span>
            <span className="yuviName">{data.bride}</span>
          </div>
        </section>

        {/* SCENE 3 — BEAUTIFUL BEGINNING */}
        <section className="yuviScene">
          <div className="yuviEyebrow">
            WITH LOVE & JOY
          </div>

          <div className="yuviGoldLine" />

          <h2 className="yuviTitle">
            A Beautiful
            <br />
            Beginning
          </h2>

          <p className="yuviText">
            {data.message}
          </p>

          {data.couplePhoto && (
            <img
              src={data.couplePhoto}
              alt="Couple"
              className="yuviPhoto yuviZoom"
              style={{ marginTop: 28 }}
            />
          )}
        </section>

        {/* SCENE 4 — RECEPTION MAIN EVENT */}
        <section className="yuviScene">
          <div className="yuviEyebrow">
            YOU ARE CORDIALLY INVITED
          </div>

          <div className="yuviGoldLine" />

          <h2 className="yuviTitle">
            Reception
          </h2>

          <div className="yuviInfoBox">
            <div className="yuviEyebrow">
              CELEBRATION OF LOVE
            </div>

            <div
              style={{
                marginTop: 24,
                color: '#f4db8b',
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontSize: 39,
              }}
            >
              {data.groom}
            </div>

            <div className="yuviAmp">&</div>

            <div
              style={{
                color: '#f4db8b',
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontSize: 39,
              }}
            >
              {data.bride}
            </div>

            <div className="yuviGoldLine" />

            <div className="yuviValue">
              {data.reception || 'Reception'}
            </div>

            <p className="yuviText" style={{ margin: '20px auto 0' }}>
              We warmly invite you to join us
              <br />
              and celebrate this beautiful evening.
            </p>
          </div>
        </section>

        {/* SCENE 5 — WEDDING CEREMONY */}
        <section className="yuviScene">
          <div className="yuviEyebrow">
            THE WEDDING CEREMONY
          </div>

          <div className="yuviGoldLine" />

          <h2 className="yuviTitle">
            The Sacred
            <br />
            Beginning
          </h2>

          <div className="yuviInfoBox">
            <div className="yuviInfoRow">
              <span className="yuviLabel">Date</span>
              <span className="yuviValue">{data.date}</span>
            </div>

            <div className="yuviInfoRow">
              <span className="yuviLabel">Time</span>
              <span className="yuviValue">{data.time}</span>
            </div>

            <div className="yuviInfoRow">
              <span className="yuviLabel">Venue</span>
              <span className="yuviValue">{data.venue}</span>
            </div>
          </div>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.venue)}`}
            target="_blank"
            rel="noreferrer"
            className="yuviButton"
            style={{ textDecoration: 'none' }}
          >
            VIEW LOCATION
          </a>
        </section>

        {/* SCENE 6 — INVITATION CARD */}
        {data.card && (
          <section className="yuviScene">
            <div className="yuviEyebrow">
              THE INVITATION
            </div>

            <div className="yuviGoldLine" />

            <h2 className="yuviTitle">
              With Love,
              <br />
              We Invite You
            </h2>

            <div className="yuviCard yuviFade">
              <img
                src={data.card}
                alt="Wedding invitation card"
              />
            </div>

            <div
              style={{
                position: 'relative',
                zIndex: 2,
                marginTop: 20,
                color: '#d8af45',
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontSize: 18,
                fontStyle: 'italic',
              }}
            >
              A day to remember,
              <br />
              a moment to cherish.
            </div>
          </section>
        )}

        {/* SCENE 7 — MEMORIES */}
        <section className="yuviScene">
          <div className="yuviEyebrow">
            OUR MEMORIES
          </div>

          <div className="yuviGoldLine" />

          <h2 className="yuviTitle">
            Moments
            <br />
            We Treasure
          </h2>

          {data.gallery.length > 0 ? (
            <div className="yuviMemoryGrid">
              {data.gallery.slice(0, 12).map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Memory ${index + 1}`}
                  style={{
                    animationDelay: `${index * .35}s`,
                  }}
                />
              ))}
            </div>
          ) : data.couplePhoto ? (
            <img
              src={data.couplePhoto}
              alt="Couple memory"
              className="yuviMemory"
            />
          ) : (
            <p className="yuviText">
              Your beautiful memories
              <br />
              will appear here.
            </p>
          )}
        </section>

        {/* SCENE 8 — SAVE THE DATE */}
        <section className="yuviScene">
          <div className="yuviGlow" />

          <div className="yuviEyebrow">
            SAVE THE DATE
          </div>

          <div className="yuviGoldLine" />

          <h2 className="yuviTitle">
            Forever
            <br />
            Begins Here
          </h2>

          <div
            style={{
              position: 'relative',
              zIndex: 2,
              marginTop: 20,
            }}
          >
            <div className="yuviName">
              {data.groom}
            </div>

            <div className="yuviAmp">&</div>

            <div className="yuviName">
              {data.bride}
            </div>
          </div>

          <div
            style={{
              position: 'relative',
              zIndex: 2,
              marginTop: 30,
              color: '#f7e5a5',
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: 24,
            }}
          >
            {data.date}
          </div>

          <p className="yuviText" style={{ marginTop: 22 }}>
            We can't wait to celebrate
            <br />
            this beautiful beginning with you.
          </p>

          <div className="yuviGoldLine" />

          <div
            style={{
              position: 'relative',
              zIndex: 2,
              marginTop: 20,
              color: '#d8af45',
              fontSize: 10,
              letterSpacing: '.3em',
            }}
          >
            YUVI STUDIO
          </div>
        </section>

      </div>
    </div>
  );
}
