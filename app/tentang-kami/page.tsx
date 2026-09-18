import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import { RevealGroup, RevealGrid, RevealItem } from "@/components/ui/Reveal";
import AboutTabs from "./AboutTabs";
import ProfileCard from "./ProfileCard";
import FaqAccordion from "./FaqAccordion";
import ContactForm from "./ContactForm";

const faqUmum = [
  {
    question: "Apa kepanjangan dari KOLEKSI?",
    answer:
      "KOLEKSI adalah singkatan dari Komunitas Mobil Elektrik Indonesia, sebuah wadah bagi pemilik, pengguna, dan pemerhati mobil listrik di Indonesia.",
  },
  {
    question: "Siapa saja yang bisa bergabung dengan KOLEKSI?",
    answer:
      "Siapa pun yang memiliki, menggunakan, dan/atau menggemari mobil listrik dapat mendaftar menjadi anggota KOLEKSI.",
  },
  {
    question: "Berapa biaya pendaftaran menjadi anggota?",
    answer:
      "Uang pendaftaran sebesar Rp200.000 (sekali bayar) dan iuran tahunan sebesar Rp300.000.",
  },
  {
    question: "Apa saja kegiatan yang diadakan KOLEKSI?",
    answer:
      "KOLEKSI rutin mengadakan touring, edukasi, sosialisasi, serta kegiatan sosial dan kemasyarakatan bagi para anggotanya.",
  },
  {
    question: "Bagaimana cara menghubungi KOLEKSI?",
    answer:
      "Anda dapat menghubungi KOLEKSI melalui email halo@koleksi.club atau nomor kontak yang tersedia di halaman Kontak Kami.",
  },
];

const pengurusUtama = [
  { name: "T.A. Edison", role: "Ketua Umum", photo: "/images/profil-1.jpg" },
  { name: "N. Tesla", role: "Wakil Ketua", photo: "/images/profil-2.jpg" },
];

const pengurusInti = [
  { name: "Elon M.", role: "Sekretaris", photo: "/images/profil-1.jpg" },
  { name: "Nikola", role: "Wakil Sekretaris", photo: "/images/profil-2.jpg" },
  { name: "M. Elon", role: "Bendahara", photo: "/images/profil-1.jpg" },
  {
    name: "Thomas",
    role: "Wakil Bendahara",
    photo: "/images/profil-2.jpg",
  },
];

const pengurusBidang = [
  { name: "Nama Anda", role: "Bidang Hubungan Kelembagaan dan Kerjasama" },
  { name: "Nama Anda", role: "Bidang Kegiatan dan Sosial" },
  { name: "Nama Anda", role: "Bidang Edukasi dan Literasi" },
  { name: "Nama Anda", role: "Bidang Advokasi Regulasi dan Kebijakan" },
  { name: "Nama Anda", role: "Bidang Keanggotaan dan Hubungan Masyarakat" },
  { name: "Nama Anda", role: "Koordinator Wilayah" },
];

export default function TentangKamiPage() {
  return (
    <>
      <Header />
      <main>
        {/* Informasi Singkat */}
        <SectionContainer variant="white">
          <RevealGroup className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <RevealItem className="space-y-6">
              <p className="text-card-title font-bold">
                Komunitas Mobil Elektrik Indonesia (KOLEKSI), merupakan
                perkumpulan otomotif, wadah silaturrahmi dan komunikasi pemilik,
                pengguna dan pemerhati/pecinta mobil listrik di Indonesia.
              </p>
              <p className="text-card-title font-bold">
                KOLEKSI memposisikan diri sebagai mitra produsen dan pemerintah
                dalam edukasi, literasi, dan sosialisasi Mobil Listrik. Bagi
                anggota, KOLEKSI menjadi sumber informasi dalam penggunaan dan
                perawatan mobil listrik.
              </p>
            </RevealItem>

            <RevealItem className="relative aspect-570/320 w-full overflow-hidden rounded-2xl">
              <Image
                src="/images/sample-image1.png"
                alt="Komunitas KOLEKSI"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </RevealItem>
          </RevealGroup>
        </SectionContainer>

        <SectionContainer withGuides withOrnament topDivider variant="white">
          <RevealGroup>
            <RevealItem>
              <AboutTabs />
            </RevealItem>
          </RevealGroup>

          {/* Profil Organisasi */}
          <RevealGroup id="profil-organisasi" className="mt-16 scroll-mt-28">
            <RevealItem>
              <SectionHeader title="Profil Organisasi" />
            </RevealItem>

            <RevealGrid className="columns-1 gap-x-12 sm:columns-2">
              <RevealItem
                as="p"
                className="mb-4 break-inside-avoid text-[14px] font-normal leading-[21px] text-koleksi-navy-dark/80"
              >
                Kendaraan bermotor listrik berbasis baterai (khususnya mobil
                listrik) merupakan moda transportasi yang paling menjadi andalan
                masyarakat di masa depan. Kehadiran moda transportasi ini
                merupakan jawaban atas tantangan berat lingkungan hidup yang
                semakin mengkhawatirkan, dari masalah krisis energi global,
                polusi udara dan kebisingan, serta persoalan pemanasan global.
                Berdasarkan kondisi lingkungan yang cukup memprihatinkan
                tersebut, banyak pihak yang mencoba menumbuhkan kesadaran tinggi
                untuk mengurangi polusi udara dan menyelamatkan bumi dengan
                menciptakan dan mendirikan komunitas mobil listrik.
              </RevealItem>
              <RevealItem
                as="p"
                className="mb-4 break-inside-avoid text-[14px] font-normal leading-[21px] text-koleksi-navy-dark/80"
              >
                Tak heran bila produsen mobil ternama berlomba-lomba
                mengembangkan teknologi mobil listrik agar dapat memenuhi
                permintaan konsumen di masa depan. Sebagai antisipasi terhadap
                disrupsi teknologi listrik dalam wahana transportasi, Pemerintah
                Indonesia menetapkan berbagai regulasi dan kebijakan terkait
                percepatan elektrifikasi kendaraan bermotor dengan segala
                insentif yang diberikan.
              </RevealItem>
              <RevealItem
                as="p"
                className="mb-4 break-inside-avoid text-[14px] font-normal leading-[21px] text-koleksi-navy-dark/80"
              >
                Terbitnya berbagai kebijakan di atas, adalah bukti niat politik
                yang kuat dari pihak pemerintah, sehingga yang saat ini
                diperlukan adalah dukungan dari masyarakat dan para pengguna
                untuk mengawal kebijakan-kebijakan tersebut sehingga
                pelaksanaannya berlangsung dengan cepat dan tepat sasaran.
              </RevealItem>
              <RevealItem
                as="p"
                className="mb-4 break-inside-avoid text-[14px] font-normal leading-[21px] text-koleksi-navy-dark/80"
              >
                Untuk mengawal kebijakan pemerintah di atas, para pemilik dan
                pengguna mobil listrik sepakat membentuk sebuah wadah komunikasi
                yang bernama Komunitas Mobil Elektrik Indonesia, disingkat
                KOLEKSI.
              </RevealItem>
              <RevealItem
                as="p"
                className="mb-4 break-inside-avoid text-[14px] font-normal leading-[21px] text-koleksi-navy-dark/80"
              >
                Kesepakatan untuk membentuk KOLEKSI dicetuskan pada saat
                pertemuan dengan Zoom antar sesama pemilik dan pengguna mobil
                listrik pada 17 Mei 2021, dan dideklarasikan pada saat kopi
                darat pemilik dan pengguna mobil listrik di Pavillion Bliss Alam
                Sutera, tanggal 23 Mei 2021. Kesepakatan tersebut tertuang dalam
                deklarasi pembentukan KOLEKSI yang ditandatangani oleh: Arwan
                Hidayat, Abdul Rahman Elly, Agus Purnomo, Aditya Prasetya Mulya,
                Singgih Sunoto, Ricky Febrian, M. Ihsan Sandy Toisuta, Wicaksono
                Indarto, Melissa, Lihua Soedarmo, Deky Adrian Raharjo, dan
                Mohamad Yogi Alamsyah.
              </RevealItem>
              <RevealItem
                as="p"
                className="mb-4 break-inside-avoid text-[14px] font-normal leading-[21px] text-koleksi-navy-dark/80"
              >
                Dalam pembentukan KOLEKSI tersebut sekaligus ditetapkan Ketua
                Umum yaitu Arwan Hidayat dan Wakil Ketua Perhimpunan Abdul
                Rahman Elly untuk periode 2021-2024, sekaligus menetapkan ketua
                dan anggota bidang serta koordinator wilayah. Rapat pembentukan
                klub tanggal 23 Mei 2021 ditetapkan sebagai tanggal lahir
                KOLEKSI. Selain itu, pada saat pembentukan klub juga telah
                ditetapkan nama klub, pengurus pendiri klub, visi dan misi
                KOLEKSI serta hal lain yang dianggap perlu untuk pembangunan
                KOLEKSI. Kemudian pembentukannya juga telah didaftarkan sebagai
                badan hukum di Direktorat Jenderal Administrasi Hukum Umum,
                Kementerian Hukum dan Hak Asasi Manusia Republik Indonesia,
                serta telah menjadi bagian dari keluarga besar IMI.
              </RevealItem>
            </RevealGrid>
          </RevealGroup>

          {/* Kepengurusan */}
          <RevealGroup id="kepengurusan" className="mt-24 scroll-mt-28">
            <RevealItem>
              <SectionHeader title="Kepengurusan" />

              <p className="text-[20px] font-bold leading-6 text-koleksi-navy-dark">
                Periode 2024–2029
              </p>
              <p className="mt-4 text-[14px] font-normal leading-[21px] text-koleksi-navy-dark/60">
                Penasihat
              </p>
            </RevealItem>

            <RevealGrid className="mt-6 mb-10 flex flex-col items-center gap-y-15">
              <div className="flex flex-wrap justify-center gap-x-25 gap-y-20">
                {pengurusUtama.map((person) => (
                  <RevealItem key={person.name}>
                    <ProfileCard {...person} />
                  </RevealItem>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-x-25 gap-y-20">
                {pengurusInti.map((person) => (
                  <RevealItem key={person.name}>
                    <ProfileCard {...person} />
                  </RevealItem>
                ))}
              </div>
            </RevealGrid>

            <RevealGrid className="mt-16 grid grid-cols-1 gap-x-16 gap-y-6 sm:grid-cols-2">
              {pengurusBidang.map((person) => (
                <RevealItem key={person.role}>
                  <p className="text-base font-bold leading-6 text-koleksi-navy-dark">
                    {person.name}
                  </p>
                  <p className="text-[14px] font-normal leading-[21px] text-koleksi-navy-dark/60">
                    {person.role}
                  </p>
                </RevealItem>
              ))}
            </RevealGrid>
          </RevealGroup>

          {/* Visi & Misi */}
          <RevealGroup
            id="visi-misi"
            className="mt-24 scroll-mt-28 grid grid-cols-1 gap-10 sm:grid-cols-2"
          >
            <RevealItem>
              <h3 className="font-display text-2xl font-bold leading-8 text-koleksi-navy">
                Visi
              </h3>
              <p className="mt-4 text-[14px] font-normal leading-[21px] text-koleksi-navy-dark/80">
                Berpartisipasi aktif dalam mewujudkan lingkungan yang bersih
                melalui sarana transportasi yang ramah lingkungan, bebas emisi
                gas rumah kaca dan bebas polusi.
              </p>
            </RevealItem>

            <RevealItem>
              <h3 className="font-display text-2xl font-bold leading-8 text-koleksi-navy">
                Misi
              </h3>
              <p className="mt-4 text-[14px] font-normal leading-[21px] text-koleksi-navy-dark/80">
                Menjadikan KOLEKSI sebagai:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] font-normal leading-[21px] text-koleksi-navy-dark/80">
                <li>Wahana silaturahmi dan komunikasi</li>
                <li>Wahana refreshing / fun</li>
                <li>Perkumpulan yang peduli sosial dan kemasyarakatan</li>
                <li>
                  Wahana edukasi, literasi, dan sosialisasi mobil listrik
                </li>
                <li>Wahana advokasi regulasi dan kebijakan</li>
                <li>
                  Wahana jembatan komunikasi dengan ATPM dan dealer maupun
                  dengan pemerintah/pemerintah daerah serta organisasi/lembaga
                  lain
                </li>
              </ul>
            </RevealItem>
          </RevealGroup>

          {/* Aturan & AD/ART */}
          <RevealGroup id="aturan-adart" className="mt-24 scroll-mt-28">
            <RevealItem>
              <SectionHeader title="Aturan & AD/ART" />
            </RevealItem>

            <RevealItem>
              <p className="text-[14px] font-normal leading-[21px] text-koleksi-navy-dark/60">
                Dokumen PDF
              </p>
              <a
                href="/documents/ad-art-koleksi.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center rounded-full border hover:border-koleksi-navy-deep/60 px-6 py-2.5 text-base font-bold text-koleksi-navy-deep transition border-koleksi-navy-deep dark:border-border-dark"
              >
                Lihat
              </a>
            </RevealItem>
          </RevealGroup>

          {/* Informasi Keanggotaan */}
          <RevealGroup id="informasi-keanggotaan" className="mt-24 scroll-mt-28">
            <RevealItem>
              <SectionHeader title="Keanggotaan" />
            </RevealItem>

            <RevealGrid className="grid grid-cols-1 gap-10 sm:grid-cols-2">
              <RevealItem>
                <h3 className="text-xl leading-6 font-bold leading-8 text-koleksi-navy-dark">
                  Persyaratan Anggota Koleksi
                </h3>
                <ol className="mt-4 list-decimal space-y-2 pl-5 text-[14px] font-normal leading-[21px] text-koleksi-navy-dark/80">
                  <li>
                    Memiliki, menggunakan, dan/atau menggemari mobil listrik
                  </li>
                  <li>
                    Mengisi Formulir pendaftaran yang sudah tersedia di website
                    Koleksi
                  </li>
                  <li>
                    Membayar uang pendaftaran/registrasi keanggotaan (sekali
                    saja) sebesar Rp200.000 (dua ratus ribu rupiah)
                  </li>
                  <li>
                    Membayar iuran tahunan sebesar Rp300.000 (tiga ratus ribu
                    rupiah)
                  </li>
                  <li>
                    Untuk tahun pertama saat mendaftar dibarengkan pembayarannya
                    bersama uang pendaftaran.
                  </li>
                  <li>
                    Uang pendaftaran dan iuran tahunan dibayarkan sekaligus.
                  </li>
                  <li>
                    Uang pendaftaran dan iuran tahun pertama dikirim ke rekening
                    bendahara :
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      <li>Nama : PERKUMPULAN KOMUNITAS MOBIL ELEKTRIK</li>
                      <li>Bank : Mandiri</li>
                      <li>No Rek : 006-00-1122229-0</li>
                    </ul>
                  </li>
                  <li>Mengirimkan pas foto (ukuran 3×4, berwarna)</li>
                  <li>
                    Anggota baru yang telah melakukan pendaftaran dan pembayaran
                    uang pendaftaran akan memperoleh :
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      <li>1 Kartu Anggota</li>
                      <li>1 baju seragam</li>
                      <li>
                        1 stiker Nomor Lambung (dipasang di kaca/bodi belakang)
                      </li>
                      <li>
                        1 stiker tulisan Komunitas Mobil Elektrik Indonesia –{" "}
                        <a
                          href="https://www.koleksi.club"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-koleksi-green underline"
                        >
                          www.koleksi.club
                        </a>{" "}
                        (34×5cm, dipasang di kaca belakang bagian atas)
                      </li>
                    </ul>
                  </li>
                </ol>

                <Link
                  href="/daftar"
                  className="mt-8 inline-flex items-center rounded-full bg-koleksi-navy-dark px-6 py-2.5 text-base font-bold leading-6 text-white transition hover:bg-koleksi-navy"
                >
                  Daftar
                </Link>
              </RevealItem>

              <RevealItem>
                <h3 className="text-xl leading-6 font-bold leading-8 text-koleksi-navy-dark">
                  Pendaftaran Ulang Anggota
                </h3>
                <ol className="mt-4 list-decimal space-y-2 pl-5 text-[14px] font-normal leading-[21px] text-koleksi-navy-dark/80">
                  <li>
                    Memiliki, menggunakan, dan/atau menggemari mobil listrik
                  </li>
                  <li>
                    Mengisi Formulir pendaftaran yang sudah tersedia di website
                    Koleksi
                  </li>
                  <li>
                    Membayar iuran tahunan sebesar Rp300.000 (tiga ratus ribu
                    rupiah)
                  </li>
                  <li>
                    Iuran tahun pertama dikirim ke rekening bendahara :
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      <li>Nama : PERKUMPULAN KOMUNITAS MOBIL ELEKTRIK</li>
                      <li>Bank : Mandiri</li>
                      <li>No Rek : 006-00-1122229-0</li>
                    </ul>
                  </li>
                  <li>Mengirimkan pas foto ukuran 3×4, berwarna</li>
                </ol>

                <Link
                  href="/daftar-ulang"
                  className="mt-8 inline-flex items-center rounded-full border border-koleksi-navy-deep px-6 py-2.5 text-base font-bold leading-6 text-koleksi-navy-deep transition hover:border-koleksi-navy-deep/60"
                >
                  Daftar Ulang
                </Link>
              </RevealItem>
            </RevealGrid>
          </RevealGroup>

          {/* Sponsorship & Partnership */}
          <RevealGroup
            id="sponsorship-partnership"
            className="mt-24 scroll-mt-28"
          >
            <RevealItem>
              <SectionHeader title="Sponsorship & Partnership" />
            </RevealItem>

            <RevealItem>
              <p className="text-[14px] font-normal leading-[21px] text-koleksi-navy-dark/60">
                Unduh Dokumen
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="/documents/proposal-sponsorship-koleksi.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border hover:border-koleksi-navy-deep/60 px-6 py-2.5 text-base font-bold text-koleksi-navy-deep transition border-koleksi-navy-deep dark:border-border-dark"
                >
                  Sponsor
                </a>
                <a
                  href="/documents/proposal-partnership-koleksi.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border hover:border-koleksi-navy-deep/60 px-6 py-2.5 text-base font-bold text-koleksi-navy-deep transition border-koleksi-navy-deep dark:border-border-dark"
                >
                  Mitra
                </a>
              </div>
            </RevealItem>
          </RevealGroup>

          {/* FAQ */}
          <RevealGroup id="faq" className="mt-24 scroll-mt-28">
            <RevealItem>
              <SectionHeader title="FAQ" />

              <h3 className="mb-6  text-xl font-bold leading-6 text-koleksi-navy-dark">
                Umum
              </h3>
            </RevealItem>

            <FaqAccordion items={faqUmum} />
          </RevealGroup>

          {/* Kontak Kami */}
          <RevealGroup id="kontak-kami" className="mt-24 scroll-mt-28">
            <RevealItem>
              <SectionHeader title="Kontak Kami" />
            </RevealItem>

            <RevealItem>
              <ContactForm />
            </RevealItem>
          </RevealGroup>
        </SectionContainer>
      </main>
      <Footer />
    </>
  );
}
