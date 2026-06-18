import { CATEGORIES } from '../../data/courses';

const CATEGORY_META = {
  basics:      { desc: 'コンピュータ・OS・情報理論' },
  programming: { desc: 'Python・JS・設計・Git' },
  network:     { desc: 'TCP/IP・DNS・ゼロトラスト' },
  database:    { desc: 'SQL・NoSQL・設計・最適化' },
  ai_ml:       { desc: 'ML・深層学習・LLM・RAG' },
  ai_security: { desc: '敵対的攻撃・LLM脆弱性・EU AI Act' },
  security:    { desc: 'OWASP・暗号化・CTF' },
  cloud:       { desc: 'AWS・Docker・K8s・Terraform' },
  business:    { desc: 'DevOps・スクラム・SRE' },
  paper:       { desc: 'Transformer・BERT・Dynamo' },
};

export default function HomeView({ onNavigateToCategory, onNavigateToLevel }) {
  return (
    <div className="view">
      <div className="hero">
        <div className="hero-orb1"></div>
        <div className="hero-orb2"></div>
        <div className="hero-grid"></div>
        <div className="hero-inner">
          <div className="hero-eyebrow"><i className="fa-solid fa-graduation-cap"></i>情報大学 Eラーニングポータル</div>
          <h1>情報技術の<span className="hl">基礎から最先端</span>まで<br />自分のペースで学ぶ</h1>
          <p>IT基礎・プログラミング・AI・AIセキュリティ・クラウド・論文まで、体系的に学べるコースを一か所に集約。YouTube動画・論文・記事をカード形式で管理し、進捗・お気に入り・保存をパーソナライズ。</p>
          <div className="hero-stats">
            <div className="hstat"><div className="n">58</div><div className="l">コース</div></div>
            <div className="hstat"><div className="n">10</div><div className="l">カテゴリー</div></div>
            <div className="hstat"><div className="n">3</div><div className="l">レベル</div></div>
            <div className="hstat"><div className="n">∞</div><div className="l">いつでも</div></div>
          </div>
        </div>
      </div>

      <div className="sec-head">カテゴリーから探す</div>
      <div className="cat-grid">
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <div
            key={key}
            className="cat-card"
            style={{ '--cc': cat.color }}
            onClick={() => onNavigateToCategory(key)}
          >
            <div className="cat-icon" style={{ background: `${cat.color}20`, color: cat.color }}>
              <i className={`fa-solid ${cat.icon}`}></i>
            </div>
            <div className="cat-name">{cat.label}</div>
            <div className="cat-desc">{CATEGORY_META[key]?.desc || ''}</div>
          </div>
        ))}
      </div>

      <section className="roadmap-section">
        <h2>学習ロードマップ</h2>
        <p className="section-sub">おすすめの学習順序</p>
        <div className="roadmap-grid">
          {[
            {
              step: '01',
              title: 'IT基礎固め',
              desc: 'コンピュータ・OS・ネットワーク・セキュリティの基礎を理解する',
              cats: ['IT基礎', 'ネットワーク', 'データベース'],
              color: '#6366f1',
              icon: 'fa-seedling',
              badge: '基本情報対応'
            },
            {
              step: '02',
              title: 'プログラミング実践',
              desc: 'Python・JavaScript・クラウドを使って実際に動くものを作る',
              cats: ['プログラミング', 'クラウド'],
              color: '#0ea5e9',
              icon: 'fa-code',
              badge: '実務直結'
            },
            {
              step: '03',
              title: 'AI・先端技術',
              desc: '機械学習・生成AI・AIセキュリティなど最前線の技術を学ぶ',
              cats: ['AI・機械学習', 'AIセキュリティ'],
              color: '#8b5cf6',
              icon: 'fa-brain',
              badge: '最先端'
            }
          ].map(path => (
            <div key={path.step} className="roadmap-card" style={{'--rc': path.color}}>
              <div className="roadmap-step">{path.step}</div>
              <div className="roadmap-icon"><i className={`fa-solid ${path.icon}`}></i></div>
              <div className="roadmap-badge">{path.badge}</div>
              <h3>{path.title}</h3>
              <p>{path.desc}</p>
              <div className="roadmap-tags">
                {path.cats.map(c => <span key={c}>{c}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="sec-head">レベルから探す</div>
      <div className="lvl-grid">
        <div className="lvl-card lvl-g" onClick={() => onNavigateToLevel('beginner')}>
          <div className="lvl-glow"></div>
          <div className="lvl-icon">🌱</div>
          <div className="lvl-title">初学者向け</div>
          <div className="lvl-desc">プログラミング未経験・IT入門者</div>
        </div>
        <div className="lvl-card lvl-a" onClick={() => onNavigateToLevel('intermediate')}>
          <div className="lvl-glow"></div>
          <div className="lvl-icon">🔥</div>
          <div className="lvl-title">中級者向け</div>
          <div className="lvl-desc">基礎知識を持つ学生・社会人</div>
        </div>
        <div className="lvl-card lvl-r" onClick={() => onNavigateToLevel('advanced')}>
          <div className="lvl-glow"></div>
          <div className="lvl-icon">🚀</div>
          <div className="lvl-title">上級者向け</div>
          <div className="lvl-desc">論文・専門技術・実務応用</div>
        </div>
      </div>
    </div>
  );
}
