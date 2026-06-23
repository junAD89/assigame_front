// PAGE : Register
// RESPONSABLE : Junior
// TODO : Formulaire inscription, appel POST /api/auth/register
// CHAMPS : Nom, Prenom, Email, Login, Motdepasse, telephone (optionnel)

import { useState } from 'react'
import { Link } from 'react-router-dom'
// ce plugin est utile pour afficher les alerts sous forme de pop up
import { ToastContainer, toast } from 'react-toastify';


export default function Register() {

  const [userName, setUserName] = useState("")
  const [userPrenom, setUserPrenom] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userMotdepasse, setUserMotdepasse] = useState("")
  const [userTelephone, setUserTelephone] = useState("")// cette option peut etre optionel
  // si j ai besoin d aller a l essentiel je pense a ne pas le calculer
  const [isLoading, setIsLoading] = useState(false)


  const handleRegisterUser = () => {
    //mise en place du loading state
    setIsLoading(true);
    try {
      //mise en place du loading state
      setIsLoading(true);
    } catch (error) {
      toast.error("Error lors de l inscription")
    }
    finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800 }}>
        Inscription
      </h1>
      <p style={{ color: '#6b7280', marginTop: '1rem' }}>
        [Page Register — à développer par Junior]
      </p>
      <p style={{ marginTop: '1rem' }}>
        <Link to="/login" style={{ color: '#F5A623' }}>Déjà un compte ? Se connecter</Link>
      </p>
    </div>
  )
}