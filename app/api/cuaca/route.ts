import { NextResponse } from "next/server";


function getWeatherInfo(code: number): { text: string; icon: "sun" | "cloud-sun" | "cloud" | "cloud-rain" | "cloud-lightning" } {
  if (code === 0) return { text: "Cerah", icon: "sun" };
  if (code === 1 || code === 2) return { text: "Cerah Berawan", icon: "cloud-sun" };
  if (code === 3) return { text: "Berawan", icon: "cloud" };
  if (code >= 45 && code <= 48) return { text: "Berkabut", icon: "cloud" };
  if (code >= 51 && code <= 67) return { text: "Hujan Ringan", icon: "cloud-rain" };
  if (code >= 80 && code <= 82) return { text: "Hujan Lokal", icon: "cloud-rain" };
  if (code >= 95) return { text: "Hujan Petir", icon: "cloud-lightning" };
  return { text: "Cerah Berawan", icon: "cloud-sun" };
}

function getAqiInfo(aqi: number) {
  if (aqi <= 50) {
    return {
      text: "Baik & Sehat",
      color: "text-emerald-700",
      percent: 85,
      barGradient: "from-emerald-500 to-[#C5D82F]",
    };
  }
  if (aqi <= 100) {
    return {
      text: "Sedang",
      color: "text-emerald-700",
      percent: 70,
      barGradient: "from-emerald-500 to-amber-500",
    };
  }
  if (aqi <= 150) {
    return {
      text: "Sensitif",
      color: "text-amber-700",
      percent: 50,
      barGradient: "from-amber-500 to-orange-500",
    };
  }
  if (aqi <= 200) {
    return {
      text: "Tidak Sehat",
      color: "text-orange-700",
      percent: 35,
      barGradient: "from-amber-500 to-orange-500",
    };
  }
  return {
    text: "Sangat Tidak Sehat",
    color: "text-rose-700",
    percent: 20,
    barGradient: "from-rose-500 to-purple-600",
  };
}

export async function GET() {
  try {
    // Koordinat Desa Sawotratap, Kec. Gedangan, Kab. Sidoarjo (-7.37, 112.74)
    const [resWeather, resAqi] = await Promise.all([
      fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=-7.37&longitude=112.74&current=temperature_2m,relative_humidity_2m,weather_code&timezone=Asia/Jakarta",
        { next: { revalidate: 300 } }
      ),
      fetch(
        "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=-7.37&longitude=112.74&current=us_aqi,pm2_5&timezone=Asia/Jakarta",
        { next: { revalidate: 300 } }
      ),
    ]);

    let temp = 30;
    let humidity = 62;
    let weatherCode = 2;
    let aqi = 45;

    if (resWeather.ok) {
      const dataWeather = await resWeather.json();
      if (dataWeather.current) {
        temp = Math.round(dataWeather.current.temperature_2m);
        humidity = Math.round(dataWeather.current.relative_humidity_2m);
        weatherCode = dataWeather.current.weather_code;
      }
    }

    if (resAqi.ok) {
      const dataAqi = await resAqi.json();
      if (dataAqi.current && typeof dataAqi.current.us_aqi === "number") {
        aqi = dataAqi.current.us_aqi;
      }
    }

    const weatherInfo = getWeatherInfo(weatherCode);
    const aqiInfo = getAqiInfo(aqi);

    return NextResponse.json({
      success: true,
      temperature: temp,
      humidity,
      weatherCode,
      weatherText: weatherInfo.text,
      weatherIcon: weatherInfo.icon,
      stasiun: "Sidoarjo, Jawa Timur • Stasiun BMKG Juanda",
      aqi,
      aqiText: aqiInfo.text,
      aqiColor: aqiInfo.color,
      aqiPercent: aqiInfo.percent,
      aqiBarGradient: aqiInfo.barGradient,
      isLive: true,
    });
  } catch (error) {
    console.error("Gagal mengambil data cuaca asli:", error);
    // Fallback data
    return NextResponse.json({
      success: true,
      temperature: 30,
      humidity: 62,
      weatherCode: 2,
      weatherText: "Cerah Berawan",
      weatherIcon: "cloud-sun",
      stasiun: "Sidoarjo, Jawa Timur • Stasiun BMKG Juanda",
      aqi: 45,
      aqiText: "Baik & Sehat",
      aqiColor: "text-emerald-700",
      aqiPercent: 85,
      aqiBarGradient: "from-emerald-500 to-[#C5D82F]",
      isLive: false,
    });
  }
}
