import React from 'react';
import './App.css';

import {BrowserRouter as Router , Route, Routes } from 'react-router-dom'; 


import Login from './Components/Login';
import AddBlog from './Components/AddBlog';
import EditBlog from './Components/EditBlog';
import DisplayBlogs from './Components/DisplayBlogs';
import ProtectedRoute from './utils/ProtectedRoute';
import EditDraft from './Components/EditDraft';
import DisplayDrafts from './Components/DisplayDrafts';
import Filter from './Components/Filter';
function App() {
  

  return (

    <div>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/editblog/:id"
            element={
              <ProtectedRoute>
                <EditBlog />
              </ProtectedRoute>
            }
          />

          <Route
            path="/editdraft/:id"
            element={
              <ProtectedRoute>
                <EditDraft />
              </ProtectedRoute>
            }
          />  

          <Route
            path="/editdraft/:id"
            element={
              <ProtectedRoute>
                <EditDraft />
              </ProtectedRoute>
            }
          />

          <Route
            path="/drafts"
            element={
              <ProtectedRoute>
                <DisplayDrafts/>
              </ProtectedRoute>
            }
          />    

          <Route path="/" element={
            <ProtectedRoute>
              <DisplayBlogs />
            </ProtectedRoute>
            } />
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
