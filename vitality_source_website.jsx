/*
Project: Vitality Source
A React-based responsive website for selling supplements and biohacking products.
Technologies: React, Chart.js, Framer Motion
Fonts: Montserrat, Open Sans
Features: Dark theme toggle, BMI & Sleep calculators, Contact form with validation, Telegram widget, microanimations

Folder structure:
src/
  ├─ components/
  │    ├─ Navbar.jsx
  │    ├─ Footer.jsx
  │    ├─ ThemeToggle.jsx
  │    ├─ CalculatorBMI.jsx
  │    ├─ CalculatorSleep.jsx
  │    ├─ ContactForm.jsx
  │    ├─ FAQ.jsx
  │    ├─ BlogCard.jsx
  │    └─ TelegramWidget.jsx
  ├─ pages/
  │    ├─ Home.jsx
  │    ├─ Blog.jsx
  │    ├─ Tools.jsx
  │    ├─ KnowledgeBase.jsx
  │    ├─ Contacts.jsx
  │    └─ About.jsx
  ├─ App.jsx
  ├─ index.jsx
  └─ theme.js
*/

// src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalStyles, lightTheme, darkTheme } from './theme';
import { ThemeProvider } from 'styled-components';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Tools from './pages/Tools';
import KnowledgeBase from './pages/KnowledgeBase';
import Contacts from './pages/Contacts';
import About from './pages/About';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem('darkMode') === 'true';
    setDarkMode(saved);
  }, []);
  const toggleTheme = () => {
    setDarkMode(prev => { localStorage.setItem('darkMode', !prev); return !prev; });
  };
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <GlobalStyles />
      <Router>
        <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/blog' element={<Blog />} />
          <Route path='/tools' element={<Tools />} />
          <Route path='/knowledge' element={<KnowledgeBase />} />
          <Route path='/contacts' element={<Contacts />} />
          <Route path='/about' element={<About />} />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;

// src/theme.js
import { createGlobalStyle } from 'styled-components';

export const lightTheme = {
  body: '#ffffff',
  text: '#333333',
  accent: '#4CAF50', // match logo
  background: '#f5f5f5'
};
export const darkTheme = {
  body: '#121212',
  text: '#f0f0f0',
  accent: '#4CAF50',
  background: '#1e1e1e'
};

export const GlobalStyles = createGlobalStyle`
  body {
    margin:0;
    padding:0;
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: 'Open Sans', sans-serif;
    transition: all 0.3s ease;
  }
  h1,h2,h3,h4,h5,h6 { font-family: 'Montserrat', sans-serif; }
  a { color: ${({ theme }) => theme.accent}; text-decoration:none; }
`;

// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const navItems = [ ['Home','/'], ['Blog','/blog'], ['Tools','/tools'], ['Knowledge','/knowledge'], ['Contacts','/contacts'], ['About','/about'] ];
export default function Navbar({ darkMode, toggleTheme }) {
  return (
    <nav style={{display:'flex', padding:'1rem', justifyContent:'space-between', background: 'inherit'}}>
      <Link to='/'><img src='/logo.png' alt='Vitality Source' style={{height:40}} /></Link>
      <div style={{display:'flex',gap:'1rem',alignItems:'center'}}>
        {navItems.map(([label,path]) => (
          <motion.div key={label} whileHover={{ scale:1.1 }}>
            <Link to={path}>{label}</Link>
          </motion.div>
        ))}
        <ThemeToggle darkMode={darkMode} toggle={toggleTheme} />
      </div>
    </nav>
  );
}

// src/components/ThemeToggle.jsx
import React from 'react';
export default function ThemeToggle({ darkMode, toggle }) {
  return (
    <button onClick={toggle} style={{border:'none', background:'transparent', cursor:'pointer'}}>
      { darkMode ? '🌙' : '☀️' }
    </button>
  );
}

// src/components/CalculatorBMI.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Doughnut } from 'react-chartjs-2';
export default function CalculatorBMI() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const calculate = e => {
    e.preventDefault();
    const h = parseFloat(height)/100;
    const w = parseFloat(weight);
    const res = (w / (h*h)).toFixed(1);
    setBmi(res);
  };
  const data = bmi ? {
    datasets: [{ data: [bmi, 40 - bmi], cutout:'70%' }]
  } : null;
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.5}}>
      <h3>BMI Calculator</h3>
      <form onSubmit={calculate}>
        <input type='number' placeholder='Height cm' required value={height} onChange={e=>setHeight(e.target.value)} />
        <input type='number' placeholder='Weight kg' required value={weight} onChange={e=>setWeight(e.target.value)} />
        <button type='submit'>Calculate</button>
      </form>
      { bmi && <Doughnut data={data} /> }
    </motion.div>
  );
}

// src/components/CalculatorSleep.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
export default function CalculatorSleep() {
  const [bed, setBed] = useState('');
  const [wake, setWake] = useState('');
  const [hours, setHours] = useState(null);
  const calc = e => {
    e.preventDefault();
    const b = new Date(`1970-01-01T${bed}`);
    const w = new Date(`1970-01-01T${wake}`);
    let diff = (w - b)/1000/3600;
    if(diff<0) diff += 24;
    setHours(diff.toFixed(1));
  };
  return (
    <motion.div whileHover={{scale:1.02}}>
      <h3>Sleep Calculator</h3>
      <form onSubmit={calc}>
        <input type='time' required value={bed} onChange={e=>setBed(e.target.value)}/>
        <input type='time' required value={wake} onChange={e=>setWake(e.target.value)}/>
        <button type='submit'>Calculate</button>
      </form>
      { hours && <p>You sleep {hours} hours</p> }
    </motion.div>
  );
}

// src/components/ContactForm.jsx
import React, { useState } from 'react';
export default function ContactForm() {
  const [data, setData] = useState({name:'',email:'',message:''});
  const [errors, setErrors] = useState({});
  const validate = () => {
    const errs = {};
    if(!data.name) errs.name='Required';
    if(!data.email.match(/^[^@]+@[^@]+\.[^@]+$/)) errs.email='Invalid email';
    if(!data.message) errs.message='Required';
    return errs;
  };
  const handle = e => setData({...data,[e.target.name]: e.target.value});
  const submit = e => {
    e.preventDefault();
    const errs = validate();
    if(Object.keys(errs).length){ setErrors(errs); return; }
    // send
    alert('Submitted!');
  };
  return (
    <form onSubmit={submit} noValidate>
      <input name='name' placeholder='Name' value={data.name} onChange={handle}/>
      {errors.name && <small>{errors.name}</small>}
      <input name='email' placeholder='Email' value={data.email} onChange={handle}/>
      {errors.email && <small>{errors.email}</small>}
      <textarea name='message' placeholder='Message' value={data.message} onChange={handle}/>
      {errors.message && <small>{errors.message}</small>}
      <button type='submit'>Send</button>
    </form>
  );
}

// src/components/FAQ.jsx
import React from 'react';
export default function FAQ() {
  const faqs = [
    {q:'What is biohacking?', a:'Optimizing health with science.'},
    {q:'How to calculate BMI?', a:'Use weight/(height^2).'},
    {q:'What are supplements?', a:'Vitamins, minerals and more.'},
    {q:'Is sleep important?', a:'Crucial for recovery.'},
    {q:'How to contact support?', a:'Use our contact form.'}
  ];
  return (
    <div>
      <h3>FAQ</h3>
      {faqs.map((f,i)=>(<details key={i}><summary>{f.q}</summary><p>{f.a}</p></details>))}
    </div>
  );
}

// src/components/BlogCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
export default function BlogCard({ title, excerpt, date }) {
  return (
    <motion.div whileHover={{ scale:1.02 }} className='card'>
      <h4>{title}</h4>
      <small>{date}</small>
      <p>{excerpt}</p>
      <a href='#'>Read more</a>
    </motion.div>
  );
}

// src/components/TelegramWidget.jsx
import React, { useEffect } from 'react';
export default function TelegramWidget() {
  useEffect(() => {
    const s = document.createElement('script');
    s.src = 'https://telegram.org/js/telegram-widget.js?15';
    s.async = true;
    document.getElementById('telegram-embed').appendChild(s);
  }, []);
  return <div id='telegram-embed' data-telegram-widget-type='button' data-user='YourTelegramBot'></div>;
}

// src/pages/Home.jsx
import React from 'react';
import { CalculatorBMI, CalculatorSleep } from '../components';
import { motion } from 'framer-motion';
import TelegramWidget from '../components/TelegramWidget';

export default function Home() {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}}>
      <section className='hero'>
        <h1>Vitality Source</h1>
        <p>Your hub for biohacking & supplements</p>
      </section>
      <section><CalculatorBMI /></section>
      <section><CalculatorSleep /></section>
      <section><TelegramWidget /></section>
    </motion.div>
  );
}

// src/pages/Blog.jsx
import React from 'react';
import BlogCard from '../components/BlogCard';
const articles = [
  {title:'Boost Your Immunity with Vitamin D', excerpt:'Learn how Vitamin D supports immune health...', date:'2025-07-01'},
  {title:'Optimizing Sleep Cycles', excerpt:'Deep dive into sleep stages and biohacks...', date:'2025-06-20'},
  {title:'Top 5 Nootropics Reviewed', excerpt:'Our picks for cognitive enhancement supplements...', date:'2025-05-15'}
];
export default function Blog() { return (<div>{articles.map((a,i)=><BlogCard key={i} {...a} />)}</div>); }

// src/pages/Tools.jsx
import React from 'react';
import CalculatorBMI from '../components/CalculatorBMI';
import CalculatorSleep from '../components/CalculatorSleep';
export default function Tools() { return (<div><CalculatorBMI /><CalculatorSleep /></div>); }

// src/pages/KnowledgeBase.jsx
import React from 'react';
import FAQ from '../components/FAQ';
export default function KnowledgeBase() { return (<div><h2>Knowledge Base</h2><FAQ /></div>); }

// src/pages/Contacts.jsx
import React from 'react';
import ContactForm from '../components/ContactForm';
export default function Contacts() { return (<div><h2>Contacts</h2><ContactForm /></div>); }

// src/pages/About.jsx
import React from 'react';
export default function About() { return (<div><h2>About Us</h2><p>Vitality Source was established in 2025 to empower health enthusiasts...</p></div>); }

// src/index.css
/* Reset & basic styles */
*{box-sizing:border-box}
body,html{margin:0;padding:0}
input,textarea,button{font-family:inherit}

/* Utility */
.card{padding:1rem;border-radius:8px;background:inherit;box-shadow:0 2px 6px rgba(0,0,0,0.1);margin:1rem 0}
button{padding:0.5rem 1rem;border:none;border-radius:4px;background:var(--accent);cursor:pointer;transition:background 0.3s}
button:hover{background:darken(var(--accent),10%)}
