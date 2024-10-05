import { useEffect, useState } from "react";
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'; import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const API_URL = 'http://localhost:8000/api/users';

function App() {
  const [userData, setUserData] = useState([])
  const [newUser, setNewUser] = useState('');
  const [updateUser, setUpdateUser] = useState({ id: '', name: '', email: '' });

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };



  async function fetchUsers() {
    try {
      await axios.get(API_URL)
        .then((response) => {
          setUserData(response.data.users);
        }).catch((error) => {
          console.log("error -->", error);
        });

    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])


  // Add a user (CREATE)
  const addUser = () => {
    axios.post(API_URL, { name: newUser })
      .then(response => {
        const addNewUserInExistingArray = response.config.data; // new user object, gonna add into the existing array
        setUserData([...userData, addNewUserInExistingArray]);
        setNewUser(''); // Reset input
        fetchUsers();
      })
      .catch(err => console.error(err));
  };

  const updateUserById = (id) => {
    console.log("id--->", id);
    axios.put(`${API_URL}/${id}`, { name: updateUser.name })
      .then(response => {
        console.log("response.data--->", response.data);
        setUserData(userData.map(u => (u.id === id ? response.data : u)));
        setUpdateUser({ id: '', name: '', email: '' }); // Reset input
        fetchUsers();
        setOpen(false);
      })
      .catch(err => console.error(err));
  };

  // Delete a user (DELETE)
  const deleteUserById = (id) => {
    console.log("id--->", id);
    axios.delete(`${API_URL}/${id}`)
      .then(() => {
        setUserData(userData.filter(u => u.id !== id));
      })
      .catch(err => console.error(err));
  };


  return (
    <>
      <h1 style={{ textAlign: 'center' }}>CRUD Operations with Express & React</h1>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <TextField
          label="e.g: John"
          id="outlined-size-small"
          defaultValue="Name"
          size="small"
          value={newUser}
          onChange={(e) => setNewUser(e.target.value)}
        />
        <Button
          sx={{ padding: '6px 12px', textAlign: 'center', marginLeft: '10px' }}
          onClick={addUser}
          variant="contained"
          size="small">
          Add User
        </Button>
      </div>

      {/* Update a user */}

      {updateUser.id && (
        <div>
          {/* <input
            type="text"
            value={updateUser.name}
            onChange={(e) => setUpdateUser({ ...updateUser, name: e.target.value })}
            placeholder="Update user name"
          /> */}
          {/* <button onClick={() => updateUserById(updateUser.id)}>Update User</button> */}
          <Dialog
            open={open}
            onClose={handleClose}
          >
            <DialogTitle>Update User</DialogTitle>
            <DialogContent>

              <TextField
                autoFocus
                required
                margin="dense"
                id="name"
                name="email"
                value={updateUser.name}
                onChange={(e) => setUpdateUser({ ...updateUser, name: e.target.value })}
                type="text"
                variant="standard"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={() => updateUserById(updateUser.id)}>Update User</Button>
            </DialogActions>
          </Dialog>
        </div >
      )
      }

      <TableContainer sx={{ maxWidth: 650, margin: 'auto', marginTop: '30px' }} component={Paper}>
        <Table sx={{ maxWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Age</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userData.map((u) => (
              <TableRow
                key={u.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {u.name}
                </TableCell>
                <TableCell align="right">{u.email}</TableCell>
                <TableCell align="right">15</TableCell>

                <TableCell align="right">
                  {/* edit button */}
                  <Button
                    onClick={() => {
                      setUpdateUser({ id: u.id, name: u.name, email: u.email })
                      setOpen(true);
                    }}
                    variant="contained"
                    size="small"
                    startIcon={<EditIcon />}>
                    Edit
                  </Button>
                  {/* delete button */}
                  <Button
                    sx={{ marginLeft: '3px', backgroundColor: '#ff0000' }}
                    onClick={() => deleteUserById(u.id)}
                    variant="contained"
                    size="small"
                    startIcon={<DeleteIcon />}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default App;