declare var instgrm: instagram.InstagramStatic;

declare namespace instagram {
  interface InstagramStatic {
    Embeds: {
      process: () => void;
    }
  }
}