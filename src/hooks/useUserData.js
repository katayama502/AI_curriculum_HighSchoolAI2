import { useState, useCallback } from 'react';

// Cookie utilities
const Cookie = {
  set(k, v, d = 365) {
    const e = new Date(Date.now() + d * 864e5).toUTCString();
    document.cookie = `${k}=${encodeURIComponent(JSON.stringify(v))};expires=${e};path=/;SameSite=Lax`;
  },
  get(k) {
    const m = document.cookie.match(new RegExp('(?:^|; )' + k + '=([^;]*)'));
    if (!m) return null;
    try { return JSON.parse(decodeURIComponent(m[1])); } catch { return null; }
  },
};

function loadData() {
  return {
    fav: Cookie.get('itp_fav') || [],
    bk: Cookie.get('itp_bk') || [],
    prog: Cookie.get('itp_prog') || {},
  };
}

export function useUserData() {
  const [data, setData] = useState(() => loadData());

  const saveAndUpdate = useCallback((next) => {
    Cookie.set('itp_fav', next.fav);
    Cookie.set('itp_bk', next.bk);
    Cookie.set('itp_prog', next.prog);
    setData({ ...next });
  }, []);

  const toggleFav = useCallback((id) => {
    setData(prev => {
      const fav = prev.fav.includes(id)
        ? prev.fav.filter(x => x !== id)
        : [...prev.fav, id];
      const next = { ...prev, fav };
      Cookie.set('itp_fav', next.fav);
      Cookie.set('itp_bk', next.bk);
      Cookie.set('itp_prog', next.prog);
      return next;
    });
    return !data.fav.includes(id);
  }, [data.fav]);

  const toggleBk = useCallback((id) => {
    setData(prev => {
      const bk = prev.bk.includes(id)
        ? prev.bk.filter(x => x !== id)
        : [...prev.bk, id];
      const next = { ...prev, bk };
      Cookie.set('itp_fav', next.fav);
      Cookie.set('itp_bk', next.bk);
      Cookie.set('itp_prog', next.prog);
      return next;
    });
    return !data.bk.includes(id);
  }, [data.bk]);

  const setProg = useCallback((id, status) => {
    setData(prev => {
      const prog = { ...prev.prog, [id]: status };
      const next = { ...prev, prog };
      Cookie.set('itp_fav', next.fav);
      Cookie.set('itp_bk', next.bk);
      Cookie.set('itp_prog', next.prog);
      return next;
    });
  }, []);

  const isFav = useCallback((id) => data.fav.includes(id), [data.fav]);
  const isBk = useCallback((id) => data.bk.includes(id), [data.bk]);
  const getProg = useCallback((id) => data.prog[id] || 'none', [data.prog]);

  return { data, isFav, isBk, getProg, toggleFav, toggleBk, setProg };
}
