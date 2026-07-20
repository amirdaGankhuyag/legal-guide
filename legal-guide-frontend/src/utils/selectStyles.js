// react-select-ийн "unstyled" горимд Tailwind классаар indigo/slate дизайны
// системд нийцүүлж, dark mode дэмждэг болгоно (Firms.jsx, Lawyers.jsx хоёуланд ашиглана)
export const selectClassNames = {
  control: (state) =>
    `rounded-xl border bg-white px-2 py-1 text-sm shadow-sm transition-colors dark:bg-slate-800 ${
      state.isFocused
        ? "border-indigo-500 ring-1 ring-indigo-500"
        : "border-slate-200 dark:border-slate-700"
    }`,
  placeholder: () => "text-slate-400 dark:text-slate-500",
  singleValue: () => "text-slate-900 dark:text-white",
  input: () => "text-slate-900 dark:text-white",
  menu: () =>
    "mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800",
  option: (state) =>
    `cursor-pointer px-3 py-2 text-sm ${
      state.isFocused
        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
        : "text-slate-700 dark:text-slate-200"
    }`,
  clearIndicator: () =>
    "cursor-pointer px-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
  dropdownIndicator: () => "px-1 text-slate-400",
  indicatorSeparator: () => "bg-slate-200 dark:bg-slate-700",
  valueContainer: () => "px-2 py-0.5",
};
