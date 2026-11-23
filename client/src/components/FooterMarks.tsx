import type { ReactNode } from "react";

function Ico({ children }: { children: ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  );
}

export function FacebookMark() {
  return (
    <Ico label="Facebook">
      <path
        fill="currentColor"
        d="M14.2 8.2h3.1V5h-3.1C11.8 5 10 6.8 10 9.2V11H8v3h2v7h3v-7h2.8l.6-3H13V9.2c0-.6.4-1 1.2-1z"
      />
    </Ico>
  );
}

export function YoutubeMark() {
  return (
    <Ico label="YouTube">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M22.6 7.1c-.3-1.2-1.2-2.1-2.4-2.3C18.2 4.4 12 4.4 12 4.4s-6.2 0-8.2.4C2.6 5 1.7 5.9 1.4 7.1 1 8.7 1 12 1 12s0 3.3.4 4.9c.3 1.2 1.2 2.1 2.4 2.3 2 .4 8.2.4 8.2.4s6.2 0 8.2-.4c1.2-.2 2.1-1.1 2.4-2.3.4-1.6.4-4.9.4-4.9s0-3.3-.4-4.9zM10 15.2V8.8l6 3.2-6 3.2z"
      />
    </Ico>
  );
}

export function InstagramMark() {
  return (
    <Ico label="Instagram">
      <rect
        x="3.2"
        y="3.2"
        width="17.6"
        height="17.6"
        rx="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.15" fill="currentColor" />
    </Ico>
  );
}

export function TiktokMark() {
  return (
    <Ico label="TikTok">
      <path
        fill="currentColor"
        d="M19.7 7.3A7 7 0 0 1 15.7 6V3h-2.6v12.3a3.3 3.3 0 1 1-3.3-3.3c.3 0 .6 0 .9.1v2.6a.9.9 0 0 0-.9-.1 1 1 0 1 0 1 1V5.8A6.9 6.9 0 0 0 19.7 9v-1.7z"
      />
    </Ico>
  );
}

export function MailMark() {
  return (
    <Ico label="ელფოსტა">
      <rect
        x="3"
        y="5.5"
        width="18"
        height="13"
        rx="2.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4.2 7.2 12 12.6l7.8-5.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </Ico>
  );
}

export function PhoneMark() {
  return (
    <Ico label="ტელეფონი">
      <path
        fill="currentColor"
        d="M7.2 3.6h2.8c.5 0 .9.3 1 .8l.6 2.6c.1.5 0 1-.4 1.3L9.6 9.8a12 12 0 0 0 4.6 4.6l1.5-1.6c.3-.4.8-.5 1.3-.4l2.6.6c.5.1.8.5.8 1v2.8c0 .6-.5 1.1-1.1 1.1C10.8 18 6 13.2 6 4.7c0-.6.5-1.1 1.2-1.1z"
      />
    </Ico>
  );
}

export function PinMark() {
  return (
    <Ico label="მისამართი">
      <path
        fill="currentColor"
        d="M12 3.2c-3.4 0-6.2 2.6-6.2 6.1 0 4.4 6.2 11.5 6.2 11.5s6.2-7.1 6.2-11.5c0-3.5-2.8-6.1-6.2-6.1zm0 8.3a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4z"
      />
    </Ico>
  );
}

export function ClockMark() {
  return (
    <Ico label="საათები">
      <circle cx="12" cy="12" r="8.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 7.5V12l3.2 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Ico>
  );
}
