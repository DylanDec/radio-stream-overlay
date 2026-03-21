// ============================================================
// OVERLAY CONFIGURATIE
// Pas deze waarden aan naar je eigen setup
// ============================================================

export const CONFIG = {
  /**
   * AzuraCast Now Playing API URL
   * Voorbeeld: http://192.168.50.25/api/nowplaying/test
   */
  AZURACAST_API_URL: 'http://192.168.50.25/api/nowplaying/test',

  /**
   * AzuraCast Stream URL (voor de audiospeler)
   * Voorbeeld: http://192.168.50.25/listen/test/radio.mp3
   */
  STREAM_URL: 'http://192.168.50.25/listen/test/radio.mp3',

  /**
   * Hoe vaak de API gepolled wordt (in milliseconden)
   */
  POLL_INTERVAL: 10_000,

  /**
   * Hoe lang het "Now Playing" scherm zichtbaar is (ms)
   */
  NOW_PLAYING_DURATION: 25_000,

  /**
   * Hoe lang de show-slideshow draait (ms)
   */
  SLIDESHOW_DURATION: 60_000,

  /**
   * Hoe lang elke slide zichtbaar is (ms)
   */
  SLIDE_DURATION: 10_000,
};
