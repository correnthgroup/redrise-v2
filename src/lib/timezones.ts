export type TimezoneRegion =
  | "Americas"
  | "Europe"
  | "Africa"
  | "Middle East"
  | "Asia"
  | "Pacific"

export type TimezoneOption = {
  value: string
  label: string
  region: TimezoneRegion
}

export const TIMEZONE_OPTIONS: TimezoneOption[] = [
  { value: "America/New_York", label: "(GMT-5) New York", region: "Americas" },
  { value: "America/Los_Angeles", label: "(GMT-8) Los Angeles", region: "Americas" },
  { value: "America/Chicago", label: "(GMT-6) Chicago", region: "Americas" },
  { value: "America/Toronto", label: "(GMT-5) Toronto", region: "Americas" },
  { value: "America/Vancouver", label: "(GMT-8) Vancouver", region: "Americas" },
  { value: "America/Mexico_City", label: "(GMT-6) Mexico City", region: "Americas" },
  { value: "America/Bogota", label: "(GMT-5) Bogota", region: "Americas" },
  { value: "America/Lima", label: "(GMT-5) Lima", region: "Americas" },
  { value: "America/Santiago", label: "(GMT-4) Santiago", region: "Americas" },
  { value: "America/Argentina/Buenos_Aires", label: "(GMT-3) Buenos Aires", region: "Americas" },
  { value: "America/Sao_Paulo", label: "(GMT-3) Sao Paulo", region: "Americas" },
  { value: "Europe/London", label: "(GMT+0) London", region: "Europe" },
  { value: "Europe/Dublin", label: "(GMT+0) Dublin", region: "Europe" },
  { value: "Europe/Lisbon", label: "(GMT+0) Lisbon", region: "Europe" },
  { value: "Europe/Paris", label: "(GMT+1) Paris", region: "Europe" },
  { value: "Europe/Berlin", label: "(GMT+1) Berlin", region: "Europe" },
  { value: "Europe/Rome", label: "(GMT+1) Rome", region: "Europe" },
  { value: "Europe/Madrid", label: "(GMT+1) Madrid", region: "Europe" },
  { value: "Europe/Amsterdam", label: "(GMT+1) Amsterdam", region: "Europe" },
  { value: "Europe/Zurich", label: "(GMT+1) Zurich", region: "Europe" },
  { value: "Europe/Stockholm", label: "(GMT+1) Stockholm", region: "Europe" },
  { value: "Europe/Athens", label: "(GMT+2) Athens", region: "Europe" },
  { value: "Europe/Istanbul", label: "(GMT+3) Istanbul", region: "Europe" },
  { value: "Africa/Casablanca", label: "(GMT+1) Casablanca", region: "Africa" },
  { value: "Africa/Lagos", label: "(GMT+1) Lagos", region: "Africa" },
  { value: "Africa/Cairo", label: "(GMT+2) Cairo", region: "Africa" },
  { value: "Africa/Johannesburg", label: "(GMT+2) Johannesburg", region: "Africa" },
  { value: "Africa/Nairobi", label: "(GMT+3) Nairobi", region: "Africa" },
  { value: "Asia/Dubai", label: "(GMT+4) Dubai", region: "Middle East" },
  { value: "Asia/Riyadh", label: "(GMT+3) Riyadh", region: "Middle East" },
  { value: "Asia/Jerusalem", label: "(GMT+2) Jerusalem", region: "Middle East" },
  { value: "Asia/Qatar", label: "(GMT+3) Doha", region: "Middle East" },
  { value: "Asia/Kolkata", label: "(GMT+5:30) Mumbai / New Delhi", region: "Asia" },
  { value: "Asia/Bangkok", label: "(GMT+7) Bangkok", region: "Asia" },
  { value: "Asia/Jakarta", label: "(GMT+7) Jakarta", region: "Asia" },
  { value: "Asia/Shanghai", label: "(GMT+8) Shanghai", region: "Asia" },
  { value: "Asia/Hong_Kong", label: "(GMT+8) Hong Kong", region: "Asia" },
  { value: "Asia/Singapore", label: "(GMT+8) Singapore", region: "Asia" },
  { value: "Asia/Taipei", label: "(GMT+8) Taipei", region: "Asia" },
  { value: "Asia/Tokyo", label: "(GMT+9) Tokyo", region: "Asia" },
  { value: "Asia/Seoul", label: "(GMT+9) Seoul", region: "Asia" },
  { value: "Australia/Perth", label: "(GMT+8) Perth", region: "Pacific" },
  { value: "Australia/Sydney", label: "(GMT+10) Sydney", region: "Pacific" },
  { value: "Australia/Melbourne", label: "(GMT+10) Melbourne", region: "Pacific" },
  { value: "Pacific/Auckland", label: "(GMT+12) Auckland", region: "Pacific" },
]

export const TIMEZONE_REGIONS: TimezoneRegion[] = [
  "Americas",
  "Europe",
  "Africa",
  "Middle East",
  "Asia",
  "Pacific",
]
