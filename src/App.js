import React, { useState, useEffect } from 'react';
import { db, storage } from './utils/firebase';
import './App.css';
import AddBlog from './Components/AddBlog';
import EditBlog from './Components/EditBlog';
import {BrowserRouter as Router , Route, Routes } from 'react-router-dom'; 
import Login from './Components/Login';
import {auth} from './utils/firebase';
import ProtectedRoute from './utils/ProtectedRoute';

function App() {
  

  return (

    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/editblog/:id"
            element={
              <ProtectedRoute>
                <EditBlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addblog"
            element={
              <ProtectedRoute>
                <AddBlog />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
    
  );
}

export default App;
