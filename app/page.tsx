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
  const musicPickerRef = useRef<HTMLInputElement | null>(null);

 const update = <K extends keyof InviteData,>(
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
            Full Screen
          </button>
        </div>

        <Invitation
          data={d}
          themeClass={d.theme}
        />
      </section>

           {d.music && (
        <audio
          ref={audioRef}
          src={d.music}
          loop
          preload="auto"
        />
      )}

      <input
        ref={musicPickerRef}
        type="file"
        accept="audio/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          fileData(file, (value) => {
            setD((old) => ({
              ...old,
              music: value,
              musicName: file.name,
            }));
            setMusicOn(true);
          });

          e.currentTarget.value = '';
        }}
      />

      {open && (
        <div
          className="modal"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9998,
            background: '#020b09',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMusicOn(false);
              setOpen(false);
            }}
            aria-label="Close invitation"
            style={{
              position: 'fixed',
              top: 16,
              left: 16,
              zIndex: 10002,
              width: 46,
              height: 46,
              borderRadius: '50%',
              border: '1px solid #f4db8b',
              background: '#06201b',
              color: '#f4db8b',
              fontSize: 27,
              cursor: 'pointer',
            }}
          >
            ×
          </button>

          <button
            type="button"
            onClick={() => {
              if (!d.music) {
                musicPickerRef.current?.click();
              } else {
                setMusicOn((value) => !value);
              }
            }}
            aria-label={
              d.music
                ? musicOn
                  ? 'Turn music off'
                  : 'Turn music on'
                : 'Add music'
            }
            style={{
              position: 'fixed',
              right: 16,
              bottom: 20,
              zIndex: 10002,
              minWidth: 54,
              height: 50,
              padding: '0 14px',
              borderRadius: 28,
              border: '1px solid #f4db8b',
              background: '#06201b',
              color: '#f4db8b',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            {!d.music
              ? '♫ Add Music'
              : musicOn
                ? '🔊 Music On'
                : '🔇 Music Off'}
          </button>

          <Invitation
            data={d}
            themeClass={d.theme}
            full
          />
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
        background: '#041713',
        color: '#f4db8b',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .yuviCinematic {
          scroll-behavior: smooth;
          scroll-snap-type: y mandatory;
          background:
            radial-gradient(circle at 50% 20%, rgba(214,177,72,.08), transparent 28%),
            #041713;
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
          padding: 48px 22px;
          box-sizing: border-box;
          background:
            radial-gradient(circle at 50% 35%, rgba(214,177,72,.12), transparent 32%),
            linear-gradient(145deg,#061c19,#0a2923 48%,#031310);
        }

        .yuviScene::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(circle at 12% 18%, rgba(255,215,120,.18) 0 1px, transparent 2px),
            radial-gradient(circle at 84% 26%, rgba(255,215,120,.14) 0 1px, transparent 2px),
            radial-gradient(circle at 22% 82%, rgba(255,215,120,.12) 0 1px, transparent 2px),
            radial-gradient(circle at 78% 76%, rgba(255,215,120,.16) 0 1px, transparent 2px);
          background-size: 145px 145px, 180px 180px, 165px 165px, 205px 205px;
          opacity: .8;
        }

        .yuviGlow {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: rgba(214,177,72,.14);
          filter: blur(70px);
          left: 50%;
          top: 40%;
          transform: translate(-50%,-50%);
          animation: yuviGlow 5s ease-in-out infinite;
          pointer-events: none;
        }

        .yuviSweep {
          position: absolute;
          top: -20%;
          left: -50%;
          width: 36%;
          height: 140%;
          transform: skewX(-18deg);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,215,120,.05),
            rgba(255,240,190,.32),
            rgba(255,215,120,.06),
            transparent
          );
          animation: yuviSweep 7s ease-in-out infinite;
          pointer-events: none;
        }

        .yuviContent {
          position: relative;
          z-index: 2;
          width: min(92vw, 520px);
        }

        .yuviEyebrow {
          color: #d8af45;
          font-size: 10px;
          letter-spacing: .32em;
          text-transform: uppercase;
        }

        .yuviTitle {
          margin: 18px 0;
          color: #f4db8b;
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: clamp(36px, 9vw, 64px);
          font-weight: 400;
          line-height: 1.02;
        }

        .yuviText {
          max-width: 480px;
          margin: 0 auto;
          color: #c5bda9;
          font-size: 13px;
          line-height: 1.85;
        }

        .yuviGoldLine {
          width: 85px;
          height: 1px;
          margin: 18px auto;
          background: linear-gradient(
            90deg,
            transparent,
            #d8af45,
            transparent
          );
        }

        .yuviNames {
          color: #f4db8b;
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: clamp(34px, 8vw, 50px);
          line-height: 1;
        }

        .yuviAmp {
          color: #d8af45;
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: 28px;
          font-style: italic;
          margin: 12px 0;
        }

        .yuviPortrait {
          width: 128px;
          height: 158px;
          object-fit: cover;
          border-radius: 75px 75px 20px 20px;
          border: 1px solid rgba(244,219,139,.55);
          box-shadow: 0 20px 55px rgba(0,0,0,.5);
        }

        .yuviCouple {
          width: min(82vw, 360px);
          max-height: 48vh;
          object-fit: cover;
          border-radius: 180px 180px 25px 25px;
          border: 1px solid rgba(244,219,139,.55);
          box-shadow:
            0 0 0 8px rgba(214,177,72,.04),
            0 30px 80px rgba(0,0,0,.6);
          animation: yuviZoom 8s ease-in-out infinite;
        }

        .yuviInfo {
          width: min(90vw, 430px);
          padding: 25px 22px;
          border: 1px solid rgba(216,175,69,.32);
          background: linear-gradient(
            145deg,
            rgba(255,255,255,.055),
            rgba(255,255,255,.015)
          );
          box-shadow: 0 25px 70px rgba(0,0,0,.4);
        }

        .yuviRow {
          padding: 15px 0;
          border-bottom: 1px solid rgba(216,175,69,.14);
        }

        .yuviRow:last-child {
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

        .yuviCard {
          width: min(88vw, 430px);
          padding: 14px;
          border: 1px solid rgba(216,175,69,.45);
          background: rgba(255,255,255,.025);
          box-shadow: 0 25px 80px rgba(0,0,0,.55);
        }

        .yuviCard img {
          width: 100%;
          max-height: 65vh;
          object-fit: contain;
          display: block;
        }

        .yuviGallery {
          width: min(90vw, 500px);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }

        .yuviGallery img {
          width: 100%;
          height: 185px;
          object-fit: cover;
          border: 1px solid rgba(216,175,69,.32);
          animation: memoryZoom 7s ease-in-out infinite;
        }

        .yuviButton {
          display: inline-block;
          margin-top: 22px;
          padding: 13px 24px;
          border: 1px solid rgba(244,219,139,.5);
          background: rgba(216,175,69,.08);
          color: #f4db8b;
          font-size: 10px;
          letter-spacing: .18em;
          text-transform: uppercase;
          text-decoration: none;
        }

        .yuviFooter {
          margin-top: 28px;
          color: #d8af45;
          font-size: 10px;
          letter-spacing: .22em;
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
            left: -50%;
            opacity: 0;
          }
          18% {
            opacity: .8;
          }
          60% {
            left: 115%;
            opacity: .8;
          }
          100% {
            left: 115%;
            opacity: 0;
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
            opacity: .88;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @media (max-width: 480px) {
          .yuviScene {
            padding: 38px 18px;
          }

          .yuviGallery img {
            height: 160px;
          }

          .yuviPortrait {
            width: 112px;
            height: 142px;
          }
        }
      `}</style>

      <div className="yuviCinematic">

        {/* 01 — GRAND OPENING */}
        <section className="yuviScene">
          <div className="yuviGlow" />
          <div className="yuviSweep" />

          <div className="yuviContent">
            <div className="yuviEyebrow">
              A BEAUTIFUL BEGINNING
            </div>

            <div className="yuviGoldLine" />

            <div
              style={{
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontSize: 16,
                letterSpacing: '.42em',
                color: '#f4db8b',
                marginLeft: '.42em',
              }}
            >
              YUVI STUDIO
            </div>

            <div
              style={{
                marginTop: 14,
                color: '#9d957f',
                fontSize: 9,
                letterSpacing: '.3em',
              }}
            >
              PRESENTS
            </div>

            <div
              style={{
                marginTop: 38,
                color: '#d8af45',
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontSize: 25,
                fontStyle: 'italic',
              }}
            >
              The Beginning of Forever
            </div>
          </div>
        </section>

        {/* 02 — COUPLE */}
        <section className="yuviScene">
          <div className="yuviContent">
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
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 15,
                marginTop: 22,
              }}
            >
              {data.groomPhoto ? (
                <img
                  src={data.groomPhoto}
                  alt={data.groom}
                  className="yuviPortrait"
                />
              ) : (
                <div
                  className="yuviPortrait"
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

              <span className="yuviAmp">&</span>

              {data.bridePhoto ? (
                <img
                  src={data.bridePhoto}
                  alt={data.bride}
                  className="yuviPortrait"
                />
              ) : (
                <div
                  className="yuviPortrait"
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
                marginTop: 22,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 14,
                flexWrap: 'wrap',
              }}
            >
              <span className="yuviNames">{data.groom}</span>
              <span className="yuviAmp">&</span>
              <span className="yuviNames">{data.bride}</span>
            </div>
          </div>
        </section>

        {/* 03 — BEAUTIFUL BEGINNING */}
        <section className="yuviScene">
          <div className="yuviContent">
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
                className="yuviCouple"
                style={{ marginTop: 28 }}
              />
            )}
          </div>
        </section>

        {/* 04 — RECEPTION */}
        <section className="yuviScene">
          <div className="yuviContent">
            <div className="yuviEyebrow">
              YOU ARE CORDIALLY INVITED
            </div>

            <div className="yuviGoldLine" />

            <h2 className="yuviTitle">
              Reception
            </h2>

            <div className="yuviInfo">
              <div className="yuviEyebrow">
                CELEBRATION OF LOVE
              </div>

              <div className="yuviNames" style={{ marginTop: 25 }}>
                {data.groom}
              </div>

              <div className="yuviAmp">&</div>

              <div className="yuviNames">
                {data.bride}
              </div>

              <div className="yuviGoldLine" />

              <div className="yuviValue">
                {data.reception || 'Reception'}
              </div>

              <p
                className="yuviText"
                style={{ marginTop: 18 }}
              >
                We warmly invite you to join us
                <br />
                and celebrate this beautiful evening.
              </p>
            </div>
          </div>
        </section>

        {/* 05 — WEDDING */}
        <section className="yuviScene">
          <div className="yuviContent">
            <div className="yuviEyebrow">
              THE WEDDING CEREMONY
            </div>

            <div className="yuviGoldLine" />

            <div
              style={{
                fontSize: 9,
                letterSpacing: '3px',
                color: '#f4db8b',
                opacity: .75,
              }}
            >
              A DAY TO REMEMBER
            </div>

            <h2 className="yuviTitle">
              The Sacred
              <br />
              Beginning
            </h2>

            <div
              style={{
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontSize: 21,
                color: '#f4db8b',
                letterSpacing: '2px',
                marginBottom: 20,
              }}
            >
              {data.bride} & {data.groom}
            </div>

            <div className="yuviInfo">
              <div className="yuviRow">
                <span className="yuviLabel">Date</span>
                <span className="yuviValue">
                  {data.date}
                </span>
              </div>

              <div className="yuviRow">
                <span className="yuviLabel">Time</span>
                <span className="yuviValue">
                  {data.time}
                </span>
              </div>

              <div className="yuviRow">
                <span className="yuviLabel">Venue</span>
                <span className="yuviValue">
                  {data.venue}
                </span>
              </div>
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                data.venue
              )}`}
              target="_blank"
              rel="noreferrer"
              className="yuviButton"
            >
              VIEW LOCATION
            </a>
          </div>
        </section>

        {/* 06 — INVITATION CARD */}
        {data.card && (
          <section className="yuviScene">
            <div className="yuviContent">
              <div className="yuviEyebrow">
                THE INVITATION
              </div>

              <div className="yuviGoldLine" />

              <h2 className="yuviTitle">
                With Love,
                <br />
                We Invite You
              </h2>

              <div className="yuviCard">
                <img
                  src={data.card}
                  alt="Wedding invitation card"
                />
              </div>

              <div
                style={{
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
            </div>
          </section>
        )}

        {/* 07 — MEMORIES */}
        <section className="yuviScene">
          <div className="yuviContent">
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
              <div className="yuviGallery">
                {data.gallery.slice(0, 12).map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Memory ${index + 1}`}
                    style={{
                      animationDelay: `${index * .25}s`,
                    }}
                  />
                ))}
              </div>
            ) : data.couplePhoto ? (
              <img
                src={data.couplePhoto}
                alt="Couple memory"
                className="yuviCouple"
              />
            ) : (
              <p className="yuviText">
                Your beautiful memories
                <br />
                will appear here.
              </p>
            )}
          </div>
        </section>

        {/* 08 — FINAL SAVE THE DATE */}
        <section className="yuviScene">
          <div className="yuviGlow" />

          <div className="yuviContent">
            <div className="yuviEyebrow">
              SAVE THE DATE
            </div>

            <div className="yuviGoldLine" />

            <h2 className="yuviTitle">
              Forever
              <br />
              Begins Here
            </h2>

            <div className="yuviNames">
              {data.bride}
            </div>

            <div
              style={{
                margin: '12px 0',
                color: '#d8af45',
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontSize: 25,
                fontStyle: 'italic',
              }}
            >
              &
            </div>

            <div className="yuviNames">
              {data.groom}
            </div>

            <div
              style={{
                marginTop: 25,
                color: '#f4db8b',
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontSize: 25,
              }}
            >
              {data.date}
            </div>

            <div
              style={{
                marginTop: 10,
                color: '#d8c9a0',
                fontSize: 13,
              }}
            >
              {data.time}
            </div>

            <div
              style={{
                marginTop: 8,
                color: '#d8c9a0',
                fontSize: 13,
              }}
            >
              {data.venue}
            </div>

            <div className="yuviGoldLine" />

            <p className="yuviText">
              {data.family}
              <br />
              <br />
              We can't wait to celebrate
              <br />
              this beautiful beginning with you.
            </p>

            <div className="yuviFooter">
              Crafted with Love • YUVI STUDIO
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
