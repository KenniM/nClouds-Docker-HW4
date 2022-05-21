import React, { Component } from 'react'

class Register extends Component {
    constructor(props) {
        super(props);
        this.handleInput = this.handleInput.bind(this);
        this.state = {
            email: '',
            name: '',
            sqlCount: 0,
            cacheCount: 0
        }
    }

    handleInput(e) {
        const { value, name } = e.target;
        if (e.target.name === "picture") {
            this.setState({
                [name]: value.toString().substring(12)
            })
        } else if (e.target.name === "birthday") {
            this.setState({
                [name]: this.convertDate(value)
            })
        } else {
            this.setState({
                [name]: value
            })
        }
    }

    componentDidMount() {
        this.getCounts();
    }

    insertSQL = () => {
        var { name, email } = this.state;
        var url = "http://localhost:3500/api/mysqlInsert"
        const requestOptions = {
            method : 'POST',
            headers : {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "name" : name,
                "email" : email
            })
        };

        fetch(url,requestOptions)
        .then(response => {
            if (response.ok){
                alert("User registered");
                this.componentDidMount();
            }else if(response.status===305){
                alert("The email already exists");
            }else{
                alert("An error ocurred when connecting to MySQL");
            }
        })
    }

    insertCache = () => {
        var { name, email } = this.state;
        var url = "http://localhost:3500/api/redisInsert";
        const requestOptions = {
            method : 'POST',
            headers : {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "name" : name,
                "email" : email
            })
        };

        fetch(url,requestOptions)
        .then(response => {
            if (response.ok){
                alert("User registered");
                this.componentDidMount();
            }else if(response.status===305){
                alert("The email already exists");
            }else{
                alert("An error ocurred when connecting to Redis");
            }
        })
    }

    getCounts = () => {
        var sqlUrl = 'http://localhost:3500/api/mysqlGetAll';
        var cacheUrl = 'http://localhost:3500/api/redisGetAll';

        fetch(sqlUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application_json'
            }
        }).then(res => res.json())
            .catch(error => console.error('Error: ', error))
            .then(response => {
                let count = response[0].count;
                this.setState({ sqlCount: count });
            });

        fetch(cacheUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application_json'
            }
        }).then(res => res.json())
            .catch(error => console.error('Error: ', error))
            .then(response => {
                let cCount = response.count;
                this.setState({ cacheCount: cCount });
            })
    }

    render() {
        return (
            <>
                <center>
                    <div className='col-md-8 mt-5'>
                        <div className="card">
                            <div className="card-body">
                                <form>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input type="email" onChange={this.handleInput} name="email" className="form-control" />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input type="text" onChange={this.handleInput} name="name" className="form-control" />
                                    </div>
                                </form>
                                <button className='btn btn-info text-white mx-3' onClick={() => this.insertSQL()}>SAVE TO SQL</button>
                                <button className='btn btn-success text-white mx-3' onClick={() => this.insertCache()}>SAVE TO CACHE</button>
                                <hr />
                                <label>Items stored in SQL: {this.state.sqlCount}</label><br />
                                <label>Items stored in Cache: {this.state.cacheCount}</label>
                            </div>
                        </div>
                    </div>
                </center>
            </>
        )
    }
}

export default Register;