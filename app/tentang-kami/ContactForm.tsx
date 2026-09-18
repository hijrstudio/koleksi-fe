"use client";

import { FormEvent, useState } from "react";

const inputClass =
  "w-full rounded-lg border border-koleksi-navy-dark/20 bg-transparent px-4 py-3 text-sm text-koleksi-navy-dark placeholder:text-koleksi-navy-dark/40 transition focus:border-koleksi-navy-deep focus:outline-none dark:border-border-dark dark:text-ink-dark";

const labelClass = "mb-2 block text-sm text-koleksi-navy-dark";

export default function ContactForm() {
  const [form, setForm] = useState({
    nama: "",
    email: "",
    phone: "",
    pesan: "",
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: wire up to a real submission endpoint
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-8 lg:grid-cols-2"
    >
      <div className="flex flex-col gap-5">
        <div>
          <label htmlFor="kontak-nama" className={labelClass}>
            Nama
          </label>
          <input
            id="kontak-nama"
            type="text"
            placeholder="Nama Anda"
            value={form.nama}
            onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="kontak-email" className={labelClass}>
            E-mail
          </label>
          <input
            id="kontak-email"
            type="email"
            placeholder="Alamat e-mail"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="kontak-phone" className={labelClass}>
            No. HP / WhatsApp
          </label>
          <input
            id="kontak-phone"
            type="tel"
            placeholder="08XX XXXX XXXX"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          className="mt-6 inline-flex w-fit items-center rounded-full bg-koleksi-navy-dark px-6 py-2.5 text-base font-bold leading-6 text-white transition hover:bg-koleksi-navy"
        >
          Kirim
        </button>
      </div>

      <div className="flex h-2/3 flex-col">
        <label htmlFor="kontak-pesan" className={labelClass}>
          Pesan
        </label>
        <textarea
          id="kontak-pesan"
          placeholder="Silakan isi pesan Anda"
          value={form.pesan}
          onChange={(e) => setForm((f) => ({ ...f, pesan: e.target.value }))}
          rows={6}
          className={`${inputClass} flex-1 resize-none`}
        />
      </div>
    </form>
  );
}
