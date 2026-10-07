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
            <button
              type="button"
              className="close"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ×
            </button>

            <button
              type="button"
              className="music"
              onClick={() => setMusicOn((value) => !value)}
            >
              {d.music
                ? musicOn
                  ? '🔊 Music On'
                  : '🔇 Music Off'
                : '♫ Add Music'}
            </button>

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
  const mainPhoto =
    data.couplePhoto ||
    data.bridePhoto ||
    data.groomPhoto;

  return (
    <div
      className={`inviteShell ${themeClass} ${
        full ? 'full' : ''
      }`}
    >
      {/* SCENE 1 — GRAND OPENING */}
<section
  className="inviteSection hero grandOpening"
  style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  }}
>
  <style>{`
    @keyframes openingGlow {
      0% {
        opacity: 0;
        transform: scale(0.96);
      }
      25% {
        opacity: 1;
      }
      70% {
        opacity: 1;
        transform: scale(1);
      }
      100% {
        opacity: 0;
        transform: scale(1.04);
      }
    }

    @keyframes openingText {
      0% {
        opacity: 0;
        transform: translateY(22px);
      }
      20% {
        opacity: 1;
        transform: translateY(0);
      }
      75% {
        opacity: 1;
      }
      100% {
        opacity: 0;
        transform: translateY(-10px);
      }
    }

    @keyframes goldShine {
      0% {
        transform: translateX(-120%);
        opacity: 0;
      }
      30% {
        opacity: 1;
      }
      70% {
        opacity: 1;
      }
      100% {
        transform: translateX(120%);
        opacity: 0;
      }
    }

    @keyframes slowZoom {
      0% {
        transform: scale(1);
      }
      100% {
        transform: scale(1.08);
      }
    }

    .openingGlow {
      position: absolute;
      width: 320px;
      height: 320px;
      border-radius: 50%;
      background: radial-gradient(
        circle,
        rgba(244,219,139,.20) 0%,
        rgba(244,219,139,.08) 35%,
        transparent 70%
      );
      animation: openingGlow 5s ease-in-out infinite;
      pointer-events: none;
    }

    .openingFrame {
      position: absolute;
      inset: 18px;
      border: 1px solid rgba(244,219,139,.22);
      border-radius: 24px;
      pointer-events: none;
    }

    .openingContent {
      position: relative;
      z-index: 2;
      width: 100%;
      padding: 40px 24px;
      animation: openingText 5s ease-in-out infinite;
    }

    .openingGoldLine {
      width: 90px;
      height: 1px;
      margin: 22px auto;
      background: linear-gradient(
        90deg,
        transparent,
        #d8af45,
        #f4db8b,
        #d8af45,
        transparent
      );
      overflow: hidden;
      position: relative;
    }

    .openingGoldLine::after {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(255,255,255,.7);
      transform: translateX(-120%);
      animation: goldShine 3s ease-in-out infinite;
    }
  `}</style>

  <div className="openingGlow" />

  <div className="openingFrame" />

  <div className="openingContent">

    <div
      className="eyebrow"
      style={{
        color: '#f4db8b',
        letterSpacing: '.32em',
        fontSize: 11,
      }}
    >
      YUVI STUDIO
    </div>

    <div className="openingGoldLine" />

    <div
      style={{
        color: '#d8af45',
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: 12,
        letterSpacing: '.28em',
        marginTop: 8,
      }}
    >
      PRESENTS
    </div>

    <div
      style={{
        marginTop: 38,
        color: '#f4db8b',
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: 52,
        lineHeight: 1.02,
        fontWeight: 400,
        letterSpacing: '.02em',
        textShadow: '0 0 28px rgba(244,219,139,.16)',
      }}
    >
      A Beautiful
      <br />
      Beginning
    </div>

    <div
      style={{
        width: 70,
        height: 1,
        background: '#d8af45',
        margin: '28px auto',
      }}
    />

    <div
      style={{
        color: '#f7e5a5',
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: 30,
        lineHeight: 1.2,
      }}
    >
      {data.groom}
    </div>

    <div
      style={{
        color: '#d8af45',
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: 22,
        fontStyle: 'italic',
        margin: '6px 0',
      }}
    >
      &
    </div>

    <div
      style={{
        color: '#f7e5a5',
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: 30,
        lineHeight: 1.2,
      }}
    >
      {data.bride}
    </div>

    <div
      style={{
        marginTop: 28,
        color: '#a9a08c',
        fontSize: 11,
        letterSpacing: '.18em',
      }}
    >
      {data.date}
    </div>

  </div>
</section>
     {/* SCENE 2 — COUPLE INTRODUCTION */}
<section className="inviteSection welcome coupleIntro">

  <div className="eyebrow">
    TOGETHER WITH THEIR FAMILIES
  </div>

  <div className="goldLine" />

  <h3>
    Two Hearts,
    <br />
    One Beautiful Journey
  </h3>

  <div
    style={{
      marginTop: 28,
      color: '#a9a08c',
      fontSize: 12,
      letterSpacing: '.12em',
    }}
  >
    WITH LOVE & JOY
  </div>

  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 18,
      marginTop: 30,
    }}
  >

    {data.groomPhoto ? (
      <div className="heroPhoto">
        <img
          src={data.groomPhoto}
          alt={data.groom}
        />
      </div>
    ) : (
      <div
        style={{
          width: 150,
          height: 190,
          border: '1px solid rgba(216,175,69,.45)',
          borderRadius: '80px 80px 20px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#8f8775',
          fontSize: 11,
          letterSpacing: '.08em',
        }}
      >
        GROOM PHOTO
      </div>
    )}

    <div
      style={{
        color: '#f4db8b',
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: 32,
        lineHeight: 1,
      }}
    >
      {data.groom}
    </div>

    <div
      style={{
        color: '#d8af45',
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: 26,
        fontStyle: 'italic',
      }}
    >
      &
    </div>

    {data.bridePhoto ? (
      <div className="heroPhoto">
        <img
          src={data.bridePhoto}
          alt={data.bride}
        />
      </div>
    ) : (
      <div
        style={{
          width: 150,
          height: 190,
          border: '1px solid rgba(216,175,69,.45)',
          borderRadius: '80px 80px 20px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#8f8775',
          fontSize: 11,
          letterSpacing: '.08em',
        }}
      >
        BRIDE PHOTO
      </div>
    )}

    <div
      style={{
        color: '#f4db8b',
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: 32,
        lineHeight: 1,
      }}
    >
      {data.bride}
    </div>

  </div>

  <div className="goldLine" />

  <p>
    {data.message}
  </p>

</section> 

     {/* SCENE 3 — RECEPTION — MAIN EVENT */}
<section className="inviteSection eventCard receptionHero">
  <div className="eyebrow">
    YOU ARE CORDIALLY INVITED
  </div>

  <h3>
    Reception
  </h3>

  <div className="cardFrame">
    <div className="eyebrow">
      CELEBRATION OF LOVE
    </div>

    <div
      style={{
        margin: '18px 0 8px',
        color: '#f4db8b',
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: 38,
        lineHeight: 1,
      }}
    >
      {data.groom}
    </div>

    <div
      style={{
        color: '#d8af45',
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: 24,
        fontStyle: 'italic',
      }}
    >
      &
    </div>

    <div
      style={{
        margin: '8px 0 22px',
        color: '#f4db8b',
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: 38,
        lineHeight: 1,
      }}
    >
      {data.bride}
    </div>

    <div className="goldLine" />

    <div
      style={{
        marginTop: 20,
        color: '#f7e5a5',
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: 30,
      }}
    >
      {data.reception || 'Reception Details'}
    </div>

    <div
      style={{
        marginTop: 18,
        color: '#c9c0a9',
        fontSize: 13,
        lineHeight: 1.7,
      }}
    >
      We warmly invite you to join us
      <br />
      and celebrate this beautiful evening.
    </div>
  </div>

  <div
    style={{
      marginTop: 24,
      color: '#9f967f',
      fontSize: 11,
      letterSpacing: '.08em',
      textAlign: 'center',
    }}
  >
    WEDDING CEREMONY • {data.date} • {data.time}
    <br />
    {data.venue}
  </div>
</section>
      {/* SCENE 4 — INVITATION CARD REVEAL */}
{data.card && (
  <section
    className="inviteSection eventCard"
    style={{
      textAlign: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >

    <div className="eyebrow">
      THE INVITATION
    </div>

    <div className="goldLine" />

    <h3
      style={{
        marginTop: 24,
        color: '#f4db8b',
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: 34,
        fontWeight: 400,
        lineHeight: 1.15,
      }}
    >
      With Love,
      <br />
      We Invite You
    </h3>

    <div
      style={{
        marginTop: 28,
        color: '#a9a08c',
        fontSize: 11,
        letterSpacing: '.14em',
      }}
    >
      PLEASE JOIN US
    </div>

    <div
      className="cardFrame"
      style={{
        marginTop: 26,
        padding: 14,
        maxWidth: '88%',
        background: 'rgba(255,255,255,.035)',
        border: '1px solid rgba(216,175,69,.35)',
        boxShadow: '0 20px 60px rgba(0,0,0,.35)',
      }}
    >
      <img
        src={data.card}
        alt="Wedding invitation"
        style={{
          display: 'block',
          width: '100%',
          maxHeight: '62vh',
          objectFit: 'contain',
        }}
      />
    </div>

    <div
      style={{
        marginTop: 22,
        color: '#d8af45',
        fontFamily: 'Cormorant Garamond, serif',
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

     {/* SCENE 5 — CINEMATIC MEMORIES */}
<section
  className="inviteSection gallery"
  style={{
    textAlign: 'center',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  }}
>
  <style>{`
    @keyframes memoryCinematic {
      0% {
        opacity: 0;
        transform: scale(1.08);
      }
      12% {
        opacity: 1;
      }
      75% {
        opacity: 1;
        transform: scale(1);
      }
      100% {
        opacity: 0;
        transform: scale(.96);
      }
    }

    .memoryCinematicFrame {
      animation: memoryCinematic 8s ease-in-out infinite;
    }
  `}</style>

  <div className="eyebrow">
    OUR MEMORIES
  </div>

  <div className="goldLine" />

  <h3
    style={{
      marginTop: 22,
      color: '#f4db8b',
      fontFamily: 'Cormorant Garamond, serif',
      fontSize: 38,
      fontWeight: 400,
      lineHeight: 1.05,
    }}
  >
    Moments
    <br />
    We Treasure
  </h3>

  <p
    style={{
      marginTop: 16,
      color: '#a9a08c',
      fontSize: 12,
      lineHeight: 1.6,
    }}
  >
    Every picture holds a beautiful memory.
  </p>

  {data.gallery.length > 0 ? (
    <div
      style={{
        marginTop: 28,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        alignItems: 'center',
      }}
    >
      {data.gallery.map((src, index) => (
        <div
          key={index}
          className="memoryCinematicFrame"
          style={{
            width: '88%',
            maxWidth: 360,
            overflow: 'hidden',
            borderRadius: 18,
            border: '1px solid rgba(216,175,69,.35)',
            boxShadow: '0 20px 60px rgba(0,0,0,.4)',
            animationDelay: `${index * 1.2}s`,
          }}
        >
          <img
            src={src}
            alt={`Memory ${index + 1}`}
            style={{
              display: 'block',
              width: '100%',
              height: 360,
              objectFit: 'cover',
            }}
          />
        </div>
      ))}
    </div>
  ) : (
    <div
      style={{
        marginTop: 30,
        color: '#8f8775',
        fontSize: 12,
        letterSpacing: '.08em',
      }}
    >
      YOUR BEAUTIFUL MEMORIES
      <br />
      WILL APPEAR HERE
    </div>
  )}

  <div
    style={{
      marginTop: 28,
      color: '#d8af45',
      fontFamily: 'Cormorant Garamond, serif',
      fontSize: 18,
      fontStyle: 'italic',
    }}
  >
    Moments that last forever.
  </div>
</section>
      {/* SCENE 6 — TRAVEL / VENUE */}
      <section className="inviteSection travel">
        <div className="eyebrow">
          JOIN US
        </div>

        <h3>
          Be There
          <br />
          With Us
        </h3>

        <p>
          Your presence will make our special
          celebration even more meaningful.
        </p>

        <div className="travelCards">
          <div>
            <strong>Wedding Venue</strong>
            <br />
            <span>{data.venue}</span>
          </div>

          <div>
            <strong>Wedding Date</strong>
            <br />
            <span>{data.date}</span>
          </div>

          <div>
            <strong>Wedding Time</strong>
            <br />
            <span>{data.time}</span>
          </div>
        </div>
      </section>

      {/* SCENE 7 — GRAND FINAL */}
      <section className="inviteSection final">
        <div className="rings" />

        <div className="eyebrow">
          FOREVER BEGINS HERE
        </div>

        <h3>
          With All Our Heart
        </h3>

        <p>
          We can't wait to celebrate
          this beautiful beginning with you.
        </p>

        <div className="goldLine" />

        <div
          style={{
            color: '#e8cd77',
            fontFamily:
              'Cormorant Garamond, serif',
            fontSize: 24,
          }}
        >
          {data.groom}
          <span style={{ margin: '0 8px' }}>
            ♡
          </span>
          {data.bride}
        </div>

        <div
          style={{
            marginTop: 25,
            color: '#8f8775',
            fontSize: 10,
            letterSpacing: '.2em',
          }}
        >
          YUVI STUDIO
        </div>
      </section>
    </div>
  );
}
