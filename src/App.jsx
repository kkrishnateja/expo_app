import './App.css'
import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState('0');
  const [fraction, setFraction] = useState('00')

  // Fetch transactions from backend when the component mounts
  useEffect(() => {
    async function fetchTransactions() {
      const response = await axios.get('http://localhost:8000/transactions');
      setTransactions(response.data); // Set the transactions state
    }

    fetchTransactions();
  }, []);

  async function addNewTransaction(e) {
    e.preventDefault();
    const price = name.split(" ")[0];

    // Send new transaction to backend
    const response = await axios.post('http://localhost:8000/transactions', {
      name: name.substring(price.length+1),
      datetime,
      description,
      price,
    });

    // Update transactions state
    setTransactions([...transactions, response.data]);

    // Clear input fields
    setName('');
    setDatetime('');
    setDescription('');
  }

  useEffect(() => {
    let balance = 0;
    let fraction = 0;

    for (const transaction of transactions) {
      balance += transaction.price;
    }

    balance = balance.toFixed(2);
    fraction = balance.split('.')[1];
    balance = balance.split('.')[0];
    
    setFraction(fraction);
    setBalance(balance);
  }, [transactions]);

  return (
    <>
      <main><h1 className={`${balance < 0 ? 'red' : 'green'}`}>{balance < 0 ? `-$${Math.abs(balance)}` : `+$${balance}`}
        <span>.{fraction}</span></h1>
        <form onSubmit={addNewTransaction}>
          <div className="basic">
            <input type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={'+200 new samsung tv'} />
            <input
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              type="datetime-local" />
          </div>

          <div className="description">
            <input type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={'description'} />
          </div>

          <button type="submit">Add new transaction</button>
        </form>

        <div className="transactions">
          {transactions.length > 0 && transactions.map((transaction, index) => (
            <div className="transaction" key={index}>
              <div className="left">
                <div className="name">{transaction.name}</div>
                <div className="description">{transaction.description}</div>
              </div>

              <div className="right">
                <div className={`price ${transaction.price < 0 ? 'red' : 'green'}`}>
                  {Number(transaction.price) < 0 ? `-$${Math.abs(transaction.price)}` : `+$${transaction.price}`}
                </div>
                <div className="datetime">{transaction.datetime}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}

export default App
