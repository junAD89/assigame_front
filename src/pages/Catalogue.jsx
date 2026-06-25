import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

// ============================================================
// CATALOGUE — VERSION MOCKÉE
//
// Les produits viennent de localStorage (clé "assigame_produits").
// Des produits par défaut sont injectés si la liste est vide.
//
// ⚠️  WHATSAPP : modifier WHATSAPP_NUMBER avec le vrai numéro pro
//   Format international sans "+" : ex. 22890000000 pour le Togo
//
// 📌 BACKEND : remplacer le useEffect de chargement des produits par :
//   const res = await api.get('/produit/list')
//   setProduits(res.data)
// ============================================================

// ⚠️ Changer ce numéro par le vrai numéro WhatsApp pro (sans le +)
const WHATSAPP_NUMBER = '22890000000'

// Produits par défaut injectés au 1er chargement
const PRODUITS_DEFAUT = [
  {
    id: 1,
    nom: 'PlayStation 5 Pro',
    description: 'Console next-gen 4K HDR, 120 FPS, SSD ultra-rapide. Vivez une immersion totale dans vos jeux préférés.',
    prix: 250000,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80',
    categorie: 'Consoles'
  },
  {
    id: 2,
    nom: 'Xbox Series X',
    description: 'La console la plus puissante de Microsoft. 12 téraflops, jeux en 4K 60 FPS, rétrocompatibilité totale.',
    prix: 220000,
    image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&q=80',
    categorie: 'Consoles'
  },
  {
    id: 3,
    nom: 'FIFA 25',
    description: 'Le football ultime. Nouveaux modes de jeu, graphismes améliorés, licences officielles de 30 ligues.',
    prix: 35000,
    image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&q=80',
    categorie: 'Jeux PC'
  },
  {
    id: 4,
    nom: 'Manette DualSense PS5',
    description: 'Retour haptique avancé, gâchettes adaptatives et micro intégré. L\'expérience de jeu réinventée.',
    prix: 45000,
    image: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=400&q=80',
    categorie: 'Accessoires'
  },
  {
    id: 5,
    nom: 'Nintendo Switch OLED',
    description: 'Écran OLED vibrant de 7", mode TV, portable et bureau. Jouez partout, tout le temps.',
    prix: 185000,
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&q=80',
    categorie: 'Consoles'
  },
  {
    id: 6,
    nom: 'Casque Logitech G Pro X',
    description: 'Son surround 7.1, micro Blue VO!CE, ultra-léger. Le choix des joueurs professionnels.',
    prix: 55000,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    categorie: 'Accessoires'
  },
]

const CATEGORIES = ['Tous', 'Consoles', 'Jeux PC', 'Accessoires']

export default function Catalogue() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [produits, setProduits] = useState([])
  const [selectedCat, setSelectedCat] = useState('Tous')
  const [loading, setLoading] = useState(true)
  const [hoveredId, setHoveredId] = useState(null)

  // Chargement : produits depuis localStorage (défauts + ajouts du dashboard)
  useEffect(() => {
    const stored = localStorage.getItem('assigame_produits')
    if (stored) {
      setProduits(JSON.parse(stored))
    } else {
      // Injection des produits par défaut au 1er lancement
      localStorage.setItem('assigame_produits', JSON.stringify(PRODUITS_DEFAUT))
      setProduits(PRODUITS_DEFAUT)
    }
    setLoading(false)
  }, [])

  // Ouvre WhatsApp avec un message pré-rempli pour l'article
  const ouvrirWhatsApp = (produit) => {
    const message = `Bonjour ! 👋\n\nJe suis intéressé(e) par votre article :\n\n🎮 *${produit.nom}*\n📝 ${produit.description}\n💰 *${produit.prix.toLocaleString('fr-FR')} FCFA*\n\nPouvez-vous me donner plus d'informations ? Merci !`
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
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
          {produits.length} article{produits.length > 1 ? 's' : ''} disponibles
        </p>
      </div>

      {/* Barre de recherche */}
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
              background: '#f9fafb', transition: 'border-color 0.2s'
            }}
          />
        </div>
      </div>

      {/* Filtres catégories */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            style={{
              padding: '0.45rem 1.2rem',
              borderRadius: '20px',
              border: '1px solid',
              borderColor: selectedCat === cat ? '#F5A623' : '#e5e7eb',
              background: selectedCat === cat ? '#F5A623' : '#fff',
              color: selectedCat === cat ? '#fff' : '#4b5563',
              fontWeight: selectedCat === cat ? 700 : 500,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grille de produits */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <p>Aucun produit trouvé pour "{search}"</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {filtered.map(p => (
            <div
              key={p.id}
              onMouseEnter={() => setHoveredId(p.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                background: '#fff',
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
                boxShadow: hoveredId === p.id
                  ? '0 8px 30px rgba(0,0,0,0.12)'
                  : '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'box-shadow 0.25s, transform 0.25s',
                transform: hoveredId === p.id ? 'translateY(-4px)' : 'none',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Image */}
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden', background: '#f3f4f6' }}>
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.nom}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s', transform: hoveredId === p.id ? 'scale(1.05)' : 'scale(1)' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                    🎮
                  </div>
                )}
                {/* Badge catégorie */}
                <span style={{
                  position: 'absolute', top: '10px', left: '10px',
                  background: 'rgba(0,0,0,0.65)', color: '#fff',
                  padding: '0.25rem 0.65rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600
                }}>
                  {p.categorie}
                </span>
              </div>

              {/* Contenu */}
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1a1a1a', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                  {p.nom}
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.85rem', lineHeight: 1.6, flex: 1, marginBottom: '1rem' }}>
                  {p.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#F5A623' }}>
                    {p.prix.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>

                {/* Bouton WhatsApp */}
                <button
                  onClick={() => ouvrirWhatsApp(p)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    background: '#25D366',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#1ebe5d'}
                  onMouseLeave={e => e.currentTarget.style.background = '#25D366'}
                >
                  {/* Icône WhatsApp SVG */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                  Je suis intéressé(e)
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}