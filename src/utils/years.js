export const MENU_YEARS = {
  "Visi dan Misi": 2020,
  "Kurikulum": 2016,
  "Pendidik dan Tenaga Kependidikan": 2016,
  "Sarana dan Prasarana": 2016,
  "Mahasiswa dan Lulusan": 2020,
  "Penelitian dan Pengabdian kepada Masyarakat": 2020,
};

export const generateYears = (start) => {
  const now = new Date().getFullYear();
  const years = [];
  for (let y = now; y >= start; y--) {
    years.push(y);
  }
  return years;
};
