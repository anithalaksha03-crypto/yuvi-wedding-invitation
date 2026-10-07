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
      <section className="inviteSection hero">
        <div className="floral" />

        <div className="heroInner">
          <div className="eyebrow">
            YUVI STUDIO
          </div>

          <div className="goldLine" />

          <div className="eyebrow">
            PRESENTS
          </div>

          <h1>
            A Beautiful
            <br />
            Beginning
          </h1>

          {mainPhoto ? (
            <div className="heroPhoto">
              <img
                src={mainPhoto}
                alt="Couple"
              />
            </div>
          ) : (
            <div
              className="heroPhoto"
              style={{
                display: 'grid',
                placeItems: 'center',
                background:
                  'linear-gradient(145deg,#15382d,#07100d)',
              }}
            >
              <span
                style={{
                  color: '#e7c76d',
                  fontFamily:
                    'Cormorant Garamond, serif',
                  fontSize: 24,
                }}
              >
                Your Couple Photo
              </span>
            </div>
          )}

          <div className="names">
            {data.groom}
            <span className="amp"> & </span>
            {data.bride}
          </div>

          <div className="dateLine">
            {data.date}
          </div>
        </div>
      </section>

      {/* SCENE 2 — WELCOME */}
      <section className="inviteSection welcome">
        <div className="eyebrow">
          {data.family}
        </div>

        <div className="goldLine" />

        <h3>
          Two Hearts,
          <br />
          One Beautiful Journey
        </h3>

        <p>{data.message}</p>
      </section>

      {/* SCENE 3 — WEDDING */}
      <section className="inviteSection eventCard">
        <div className="eyebrow">
          SAVE THE DATE
        </div>

        <h3>
          The Wedding
        </h3>

        <div className="cardFrame">
          <div className="eyebrow">
            WEDDING CEREMONY
          </div>

          <div
            style={{
              margin: '20px 0',
              color: '#f4db8b',
              fontFamily:
                'Cormorant Garamond, serif',
              fontSize: 30,
            }}
          >
            {data.date}
          </div>

          <div className="eventDetails">
            <div>✦ {data.time}</div>
            <div>✦ {data.venue}</div>
          </div>

          {data.reception && (
            <div
              style={{
                marginTop: 22,
                paddingTop: 18,
                borderTop:
                  '1px solid rgba(231,199,109,.18)',
                color: '#cfc3a5',
                lineHeight: 1.6,
              }}
            >
              {data.reception}
            </div>
          )}
        </div>
      </section>

      {/* SCENE 4 — INVITATION CARD */}
      {data.card && (
        <section className="inviteSection eventCard">
          <div className="eyebrow">
            THE INVITATION
          </div>

          <h3>
            With Love,
            <br />
            We Invite You
          </h3>

          <div className="cardFrame">
            <img
              src={data.card}
              alt="Wedding invitation"
            />
          </div>
        </section>
      )}

      {/* SCENE 5 — MEMORIES */}
      <section className="inviteSection gallery">
        <div className="eyebrow">
          OUR MEMORIES
        </div>

        <h3>
          Moments
          <br />
          We Treasure
        </h3>

        {data.gallery.length > 0 ? (
          <div className="galleryGrid">
            {data.gallery.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Memory ${index + 1}`}
              />
            ))}
          </div>
        ) : (
          <p>
            Your beautiful memories will appear here.
          </p>
        )}
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
