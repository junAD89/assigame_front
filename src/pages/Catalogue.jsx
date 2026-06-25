import { useState, useEffect } from 'react'

// ============================================================
// CATALOGUE — VERSION MOCKÉE avec modal de détail produit
//
// Cliquer sur une carte → ouvre une modal scrollable avec :
//   - grande image
//   - nom, description complète, prix, catégorie
//   - bouton WhatsApp pré-rempli
//
// ⚠️ WHATSAPP_NUMBER : changer par le vrai numéro pro (sans +)
// ============================================================

const WHATSAPP_NUMBER = '22890000000'

const PRODUITS_DEFAUT = [
  {
    id: 1,
    nom: 'PlayStation 5 Pro',
    description: 'La console next-gen signée Sony. Profitez d\'une résolution 4K native, d\'un taux de rafraîchissement allant jusqu\'à 120 FPS, d\'un SSD ultra-rapide qui réduit les temps de chargement à presque zéro, et d\'un rendu haptique révolutionnaire via la manette DualSense. Une immersion totale dans vos univers favoris, avec le ray tracing en temps réel pour des rendus lumineux époustouflants.',
    prix: 250000,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80',
    categorie: 'Consoles',
    specs: ['4K HDR', '120 FPS', 'SSD 825 Go', 'Ray Tracing', 'Rétrocompatible PS4']
  },
  {
    id: 2,
    nom: 'Xbox Series X',
    description: 'La console la plus puissante jamais conçue par Microsoft. Avec 12 téraflops de puissance graphique, des jeux en 4K 60 FPS (jusqu\'à 120 FPS), le Quick Resume pour reprendre plusieurs jeux instantanément, et une rétrocompatibilité totale avec des milliers de titres Xbox, Xbox 360 et Xbox One. Le Game Pass transforme votre expérience avec des centaines de jeux inclus.',
    prix: 220000,
    image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80',
    categorie: 'Consoles',
    specs: ['4K 60 FPS', '12 Téraflops', 'SSD 1 To', 'Quick Resume', 'Game Pass compatible']
  },
  {
    id: 3,
    nom: 'FIFA 25',
    description: 'Le football ultime revient avec FIFA 25. Découvrez des mécaniques de jeu repensées avec le nouveau système Rush, des animations de joueurs ultra-réalistes grâce à l\'HyperMotion V, et plus de 30 ligues officielles avec leurs joueurs, stades et kits authentiques. Les modes Ultimate Team, Carrière et Pro Clubs ont été enrichis avec de nouvelles fonctionnalités communautaires.',
    prix: 35000,
    image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&q=80',
    categorie: 'Jeux PC',
    specs: ['30+ ligues officielles', 'HyperMotion V', 'Mode Rush', 'Ultimate Team', 'Multijoueur en ligne']
  },
  {
    id: 4,
    nom: 'Manette DualSense PS5',
    description: 'La manette DualSense redéfinit le jeu avec son retour haptique avancé qui simule les textures et les impacts, et ses gâchettes adaptatives qui offrent une résistance variable selon les actions en jeu (tirer à l\'arc, accélérer, freiner). Le microphone intégré vous permet de parler sans casque. Conçue avec une ergonomie premium pour de longues sessions de jeu.',
    prix: 45000,
    image: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=800&q=80',
    categorie: 'Accessoires',
    specs: ['Retour haptique', 'Gâchettes adaptatives', 'Microphone intégré', 'Bluetooth 5.1', 'USB-C']
  },
  {
    id: 5,
    nom: 'Nintendo Switch OLED',
    description: 'La Nintendo Switch OLED embarque un magnifique écran OLED de 7 pouces avec des couleurs vibrantes et des noirs profonds. Jouez en mode TV sur votre télévision, en mode portable n\'importe où, ou posez-la sur son socle en mode bureau. La nouvelle station d\'accueil inclut un port LAN filaire pour des parties en ligne plus stables. Profitez de tous les exclusifs Nintendo : Mario, Zelda, Pokémon...',
    prix: 185000,
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&q=80',
    categorie: 'Consoles',
    specs: ['Écran OLED 7"', '3 modes de jeu', 'Port LAN filaire', 'Autonomie 4.5-9h', 'Stockage 64 Go']
  },
  {
    id: 6,
    nom: 'Casque Logitech G Pro X',
    description: 'Le casque de référence des joueurs professionnels et streamers du monde entier. Le son surround 7.1 DTS Headphone:X 2.0 vous plonge au cœur de l\'action. Le micro Blue VO!CE avec filtres à air intégré capture votre voix avec une clarté broadcast. Ultra-léger (320g) avec des coussinets en cuir souple et en velours pour un confort maximal lors de vos sessions prolongées.',
    prix: 55000,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    categorie: 'Accessoires',
    specs: ['Son 7.1 DTS', 'Micro Blue VO!CE', 'Driver PRO-G 50mm', '320g ultra-léger', 'USB + 3.5mm']
  },
]

const CATEGORIES = ['Tous', 'Consoles', 'Jeux PC', 'Accessoires']

export default function Catalogue() {
  const [search, setSearch] = useState('')
  const [produits, setProduits] = useState([])
  const [selectedCat, setSelectedCat] = useState('Tous')
  const [loading, setLoading] = useState(true)
  const [hoveredId, setHoveredId] = useState(null)
  const [produitSelectionne, setProduitSelectionne] = useState(null) // modal

  useEffect(() => {
    const stored = localStorage.getItem('assigame_produits')
    if (stored) {
      setProduits(JSON.parse(stored))
    } else {
      localStorage.setItem('assigame_produits', JSON.stringify(PRODUITS_DEFAUT))
      setProduits(PRODUITS_DEFAUT)
    }
    setLoading(false)
  }, [])

  // Fermer modal avec Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setProduitSelectionne(null) }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  // Bloquer le scroll body quand modal ouverte
  useEffect(() => {
    document.body.style.overflow = produitSelectionne ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [produitSelectionne])

  const ouvrirWhatsApp = (produit) => {
    const message = `Bonjour ! 👋\n\nJe suis intéressé(e) par votre article :\n\n🎮 *${produit.nom}*\n📝 ${produit.description.substring(0, 100)}...\n💰 *${produit.prix.toLocaleString('fr-FR')} FCFA*\n\nPouvez-vous me donner plus d'informations ? Merci !`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const filtered = produits.filter(p => {
    const matchSearch = p.nom?.toLowerCase().includes(search.toLowerCase()) ||
                        p.description?.toLowerCase().includes(search.toLowerCase())
    const matchCat = selectedCat === 'Tous' || p.categorie === selectedCat
    return matchSearch && matchCat
  })

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: '#6b7280' }}>
      Chargement du catalogue...
    </div>
  )

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2.5rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '0.5rem' }}>
          Notre <span style={{ color: '#F5A623' }}>Catalogue</span>
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1rem' }}>
          {produits.length} article{produits.length > 1 ? 's' : ''} disponibles — cliquez sur un article pour en savoir plus
        </p>
      </div>

      {/* Recherche */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
          <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}
            width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem',
              borderRadius: '12px', border: '1px solid #e5e7eb',
              fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
              background: '#f9fafb'
            }}
          />
        </div>
      </div>

      {/* Catégories */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            style={{
              padding: '0.45rem 1.2rem', borderRadius: '20px', border: '1px solid',
              borderColor: selectedCat === cat ? '#F5A623' : '#e5e7eb',
              background: selectedCat === cat ? '#F5A623' : '#fff',
              color: selectedCat === cat ? '#fff' : '#4b5563',
              fontWeight: selectedCat === cat ? 700 : 500,
              fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grille produits */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <p>Aucun produit trouvé</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {filtered.map(p => (
            <div
              key={p.id}
              onClick={() => setProduitSelectionne(p)}
              onMouseEnter={() => setHoveredId(p.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb',
                overflow: 'hidden', cursor: 'pointer',
                boxShadow: hoveredId === p.id ? '0 8px 30px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'box-shadow 0.25s, transform 0.25s',
                transform: hoveredId === p.id ? 'translateY(-4px)' : 'none',
                display: 'flex', flexDirection: 'column'
              }}
            >
              {/* Image */}
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden', background: '#f3f4f6' }}>
                {p.image ? (
                  <img
                    src={p.image} alt={p.nom}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s', transform: hoveredId === p.id ? 'scale(1.05)' : 'scale(1)' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🎮</div>
                )}
                <span style={{
                  position: 'absolute', top: '10px', left: '10px',
                  background: 'rgba(0,0,0,0.65)', color: '#fff',
                  padding: '0.25rem 0.65rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600
                }}>
                  {p.categorie}
                </span>
              </div>

              {/* Infos carte */}
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1a1a1a', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                  {p.nom}
                </h3>
                <p style={{
                  color: '#6b7280', fontSize: '0.85rem', lineHeight: 1.6, flex: 1,
                  overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical', marginBottom: '1rem'
                }}>
                  {p.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#F5A623' }}>
                    {p.prix.toLocaleString('fr-FR')} FCFA
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontStyle: 'italic' }}>
                    Voir les détails →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── MODAL DÉTAIL PRODUIT ─────────────────────────────── */}
      {produitSelectionne && (
        <div
          onClick={() => setProduitSelectionne(null)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 300, padding: '1rem'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: '20px',
              width: '100%', maxWidth: '700px',
              maxHeight: '90vh', overflowY: 'auto',
              boxShadow: '0 25px 80px rgba(0,0,0,0.25)',
              animation: 'modalIn 0.25s ease'
            }}
          >
            {/* Image grande */}
            <div style={{ position: 'relative', height: '320px', background: '#f3f4f6', borderRadius: '20px 20px 0 0', overflow: 'hidden' }}>
              {produitSelectionne.image ? (
                <img
                  src={produitSelectionne.image}
                  alt={produitSelectionne.nom}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>🎮</div>
              )}

              {/* Badge catégorie sur l'image */}
              <span style={{
                position: 'absolute', top: '16px', left: '16px',
                background: 'rgba(0,0,0,0.7)', color: '#fff',
                padding: '0.35rem 0.9rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600
              }}>
                {produitSelectionne.categorie}
              </span>

              {/* Bouton fermer */}
              <button
                onClick={() => setProduitSelectionne(null)}
                style={{
                  position: 'absolute', top: '14px', right: '14px',
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'rgba(0,0,0,0.6)', color: '#fff',
                  border: 'none', cursor: 'pointer', fontSize: '1.1rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>

            {/* Contenu scrollable */}
            <div style={{ padding: '2rem' }}>

              {/* Nom + prix */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: '#1a1a1a', lineHeight: 1.2, flex: 1 }}>
                  {produitSelectionne.nom}
                </h2>
                <span style={{ fontWeight: 800, fontSize: '1.5rem', color: '#F5A623', whiteSpace: 'nowrap' }}>
                  {produitSelectionne.prix.toLocaleString('fr-FR')} FCFA
                </span>
              </div>

              {/* Description complète */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
                  Description
                </h3>
                <p style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.8 }}>
                  {produitSelectionne.description}
                </p>
              </div>

              {/* Specs / points clés si disponibles */}
              {produitSelectionne.specs && produitSelectionne.specs.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
                    Caractéristiques
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {produitSelectionne.specs.map((s, i) => (
                      <span key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '0.35rem',
                        background: '#f3f4f6', padding: '0.4rem 0.85rem',
                        borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600, color: '#1a1a1a'
                      }}>
                        <span style={{ color: '#22c55e' }}>✓</span> {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Séparateur */}
              <div style={{ height: '1px', background: '#f3f4f6', marginBottom: '1.5rem' }} />

              {/* Bouton WhatsApp */}
              <button
                onClick={() => ouvrirWhatsApp(produitSelectionne)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '0.65rem', padding: '1rem', background: '#25D366', color: '#fff',
                  border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', transition: 'background 0.2s',
                  boxShadow: '0 4px 16px rgba(37,211,102,0.3)'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#1ebe5d'}
                onMouseLeave={e => e.currentTarget.style.background = '#25D366'}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                Je suis intéressé(e) — Contacter via WhatsApp
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#9ca3af', marginTop: '0.75rem' }}>
                Appuyez sur Échap ou cliquez en dehors pour fermer
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Animation CSS modale */}
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}