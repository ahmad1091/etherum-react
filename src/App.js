import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";
import { Component } from "react";

class App extends Component {
  state = { manager: "", players: [], balance: "", value: "", message: "" };

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();

    const manager = await lottery.methods.manager().call({ from: accounts[0] });
    console.log("------", manager);
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, players, balance });
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "waiting on transacition.." });
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether"),
    });
    this.setState({ message: "you have enter" });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "waiting on transacition.." });
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    this.setState({ message: "Congrates" });
  };

  render() {
    return (
      <div>
        <h1>lottery Contract</h1>
        <ul>
          <li>Manager Adress: {this.state.manager}</li>
          <li>NumberOf players: {this.state.players.length}</li>
          <li>
            Price Amount: {web3.utils.fromWei(this.state.balance, "ether")}
          </li>
        </ul>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h2>you can Enter the contract fromm here</h2>
          <div>
            <label>Amount of ether to Enter </label>
            <input
              value={this.state.value}
              onChange={(event) => {
                this.setState({ value: event.target.value });
              }}
            />
          </div>
          <button>Enter</button>
        </form>
        <hr />
        <h2>pick a winnner</h2>
        <button onClick={this.onClick}>Pick Winner</button>
        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
