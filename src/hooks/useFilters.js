import { useState, useMemo } from 'react';
import { COURSES } from '../data/courses';

export function useFilters() {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('all');
  const [level, setLevel] = useState('all');
  const [type, setType] = useState('all');
  const [examOnly, setExamOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return COURSES.filter(c => {
      if (cat !== 'all' && c.category !== cat) return false;
      if (level !== 'all' && c.level !== level) return false;
      if (type !== 'all' && c.type !== type) return false;
      if (examOnly && c.examRelevant !== true) return false;
      if (q) {
        const haystack = [c.title, c.description, ...(c.tags || []), c.channel || '', c.author || ''].join(' ').toLowerCase();
        if (!q.split(/\s+/).every(w => haystack.includes(w))) return false;
      }
      return true;
    });
  }, [query, cat, level, type, examOnly]);

  return { query, setQuery, cat, setCat, level, setLevel, type, setType, filtered, examOnly, setExamOnly };
}
