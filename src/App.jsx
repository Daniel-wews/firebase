import { db, auth } from './firebaseConection'
import { useState, useEffect } from 'react'
import { doc, setDoc, collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore'

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'

import './App.css'

function App() {
  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')
  const [posts, setPosts] = useState([])
  const [idPost, setIdPost] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const [user,setUser] = useState (false)
  const [userDetails,setUserDetails] = useState ({})

  useEffect(() => {
    async function loadPosts() {
      const unsub = onSnapshot(collection(db, 'posts'), (snapshot) => {

        let listaPost = [];

        snapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          })
        })
        setPosts(listaPost)
      })
    }
    loadPosts();
  }, [])

  async function handleAdd() {
    await addDoc(collection(db, 'posts'), {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        setAutor('')
        setTitulo('')
      })
      .catch((error) => {
        console.log("ERRO" + error)
      })
  }

  async function BuscarPost() {
    const postRef = collection(db, 'posts')
    await getDocs(postRef)
      .then((snapshot) => {
        let lista = []
        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          })
        })
        setPosts(lista)
      })
      .catch((error) => {
        console.log('Deu algum erro ao buscar: ' + error)
      })
  }

  async function editarPost() {
    const docRef = doc(db, 'posts', idPost)
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        console.log('post atualizado')
        setIdPost('')
        setTitulo('')
        setAutor('')
      })
      .catch(() => {
        console.log('erro ao atualizar post')
      })
  }

  async function excluirPost(id) {
    const docRef = doc(db, 'posts', id)
    await deleteDoc(docRef)
      .then(() => {
        alert('post deletado com sucesso')
      })
  }

 async function novoUsuario(){
    await createUserWithEmailAndPassword(auth, email, senha)
    .then(()=>{
      console.log('cadastrado com sucesso')
      setEmail('')
      setSenha('')
    })
    .catch((error) => {
      if(error.code === 'auth/weak-password'){
        alert('senha muito fraca')
      }else if(error.code === 'auth/email-already-in-use'){
        alert('email ja existe')
      }
    })
  }

  async function logarUsuario(){
    await signInWithEmailAndPassword(auth,email, senha)
    .then((value) => {
      console.log('user logado com sucesso')
      console.log(value.user)

      setUserDetails({
        uid: value.user.uid,
        email: value.user.email,
      })
      setUser(true)

      setEmail('')
      setSenha('')
    })
    .catch(() => {
      console.log("erro ao fazer login")
    })
  }

  async function fazerLogout(){
    await signOut(auth)
    setUser(false)
    setUserDetails({})
  }

  useEffect ( () =>{
    async function checkLogin(){
      onAuthStateChanged(auth, (user) =>{
        if(user){
          // se tem usuario logado ele entra aqui
          console.log(user)
          setUser(true);
          setUserDetails({
            uid: user.id,
            email:user.email
          })
        }else{
          // nao possui nenhum user logado
          setUser(false)
          setUserDetails({})
        }
      })
    }
    checkLogin()
  }, [])

  return (
    <>
      <div>
        <h1>React Firebase</h1>
        {user&& (
          <div>
            <strong>Seja bem-vindo(a) (Você esta logado!)</strong><br />
            <span>id: {userDetails.uid} - Email: {userDetails.email}</span><br />
            <button onClick={fazerLogout}>Sair da conta</button>
            <br /><br />
          </div>
        )}

        <div className="container">
          <h2>usuarios</h2>
          <label htmlFor="email">Email</label>
          <input value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='digite seu email'
          /> <br />

          <label htmlFor="senha">senha</label>
          <input value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder='digite uma senha'
          /> <br />
        </div>

        <button onClick={novoUsuario}>cadastrar</button><br />
        <button onClick={logarUsuario}>logar</button>


        <br /><br />
        <hr />

        <div className="container">
          <label>ID do post: </label>
          <input type="text" placeholder='digite o id do post'
            value={idPost}
            onChange={(e) => setIdPost(e.target.value)}
          />
          <label>Titulo:</label>
          <textarea
            type='text'
            placeholder='Digite o titulo'
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <label>Autor:</label>
          <input
            type="text"
            placeholder='Autor do post'
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
          />

          <button onClick={handleAdd}>Cadastrar</button>
          <button onClick={BuscarPost}>Buscar Post</button><br />

          <button onClick={editarPost}>atualizar post</button>

          <ul>
            {posts.map((post) => (
              <li key={post.id}>
                <strong>ID: {post.id}</strong><br />
                <span>Titulo: {post.titulo}</span> <br />
                <span>Autor: {post.autor}</span><br />
                <button onClick={() => excluirPost(post.id)}>Excluir</button><br /><br />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export default App
