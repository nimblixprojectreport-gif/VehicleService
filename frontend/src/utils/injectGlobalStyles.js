export default function injectGlobalStyles() {
  if (!document.getElementById('gfonts-auth')) {
    const link = document.createElement('link');
    link.id = 'gfonts-auth';
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap';
    document.head.appendChild(link);
  }

  if (!document.getElementById('auth-base')) {
    const styleTag = document.createElement('style');
    styleTag.id = 'auth-base';
    styleTag.textContent =
      "*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}html,body{min-height:100vh;background:#0d1117;color:#e6edf3;font-family:'DM Sans',sans-serif;}#root{min-height:100vh;}";
    document.head.appendChild(styleTag);
  }
}
