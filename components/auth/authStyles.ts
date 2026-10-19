/* Class bersama untuk form di halaman auth (Masuk, Lupa Kata Sandi, Daftar).
   Ukuran diambil dari desain 1440px: input 44px (placeholder 16px, padding
   20px), tombol submit 143x52 teks 20px, tombol outline 45px teks 18px. */

export const authLabelClass =
  "mb-2 block text-sm leading-4 text-koleksi-navy-dark dark:text-ink-dark";

export const authInputClass =
  "h-11 w-full rounded-lg border border-koleksi-navy-dark/15 bg-transparent px-5 text-base text-koleksi-navy-dark placeholder:text-koleksi-navy-dark/30 transition focus:border-koleksi-navy-deep focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 dark:border-border-dark dark:text-ink-dark dark:placeholder:text-ink-dark/30 dark:focus:border-ink-dark/40";

export const authSubmitClass =
  "inline-flex min-w-35.75 items-center justify-center rounded-full bg-koleksi-navy-dark px-8 py-2.5 text-xl leading-8 font-bold text-white transition hover:bg-koleksi-navy focus-visible:ring-2 focus-visible:ring-koleksi-green focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:bg-koleksi-green dark:hover:bg-koleksi-green-dark";

export const authOutlineClass =
  "inline-flex h-11.25 items-center justify-center rounded-full border border-koleksi-navy-dark px-5 text-lg font-bold text-koleksi-navy-dark transition hover:border-koleksi-green hover:text-koleksi-green dark:border-ink-dark/40 dark:text-ink-dark";

export const authSectionTitleClass =
  "text-xl leading-6 font-bold text-koleksi-navy-dark dark:text-ink-dark";

export const authErrorClass = "mt-2 text-xs text-red-600 dark:text-red-400";
