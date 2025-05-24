import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
} from '@mui/material';
import axios from 'axios';

interface Faltada {
  id: number;
  author: string;
  motivo: string;
  created_at: string;
}

const API_URL = 'https://apifaltades.pezmosca.com';

function App() {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [motivo, setMotivo] = useState('');
  const [faltadas, setFaltadas] = useState<Faltada[]>([]);
  const [tab, setTab] = useState(0);

  const fetchCount = async () => {
    try {
      const response = await axios.get(`${API_URL}/faltadas/count`);
      setCount(response.data.count);
    } catch (error) {
      console.error('Error fetching count:', error);
    }
  };

  const fetchFaltadas = async () => {
    try {
      const response = await axios.get(`${API_URL}/faltadas/`);
      setFaltadas(response.data);
    } catch (error) {
      console.error('Error fetching faltadas:', error);
    }
  };

  useEffect(() => {
    fetchCount();
    fetchFaltadas();

    // Refresh count every minute
    const interval = setInterval(fetchCount, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    try {
      await axios.post(`${API_URL}/faltadas/`, { author, motivo });
      setOpen(false);
      setAuthor('');
      setMotivo('');
      fetchCount();
      fetchFaltadas();
    } catch (error) {
      console.error('Error creating faltada:', error);
    }
  };

  const handleClearHistory = async () => {
    try {
      await axios.delete(`${API_URL}/faltadas/`);
      setConfirmOpen(false);
      fetchCount();
      fetchFaltadas();
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, p: 2 }}>
          Contador de Faltadas
        </Typography>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} centered>
          <Tab label="Contador" />
          <Tab label="Historial" />
        </Tabs>

        {tab === 0 && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="h2" gutterBottom>
              {count}
            </Typography>
            <Typography variant="h6" gutterBottom>
              días sin faltadas
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                mt: 4,
                width: 200,
                height: 200,
                borderRadius: '50%',
                fontSize: '1.5rem',
              }}
              onClick={() => setOpen(true)}
            >
              FALTADA
            </Button>
          </Box>
        )}

        {tab === 1 && (
          <Box sx={{ mt: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setConfirmOpen(true)}
              >
                Vaciar Historial
              </Button>
            </Box>
            <List>
              {faltadas.map((faltada) => (
                <Paper key={faltada.id} sx={{ mb: 2, p: 2 }}>
                  <ListItem>
                    <ListItemText
                      primary={faltada.motivo}
                      secondary={`Por: ${faltada.author} - ${new Date(faltada.created_at).toLocaleDateString()}`}
                    />
                  </ListItem>
                </Paper>
              ))}
            </List>
          </Box>
        )}

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Nueva Faltada</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Autor"
              fullWidth
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Motivo"
              fullWidth
              multiline
              rows={4}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Guardar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>Confirmar Acción</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Estás seguro de que quieres vaciar todo el historial? Esta acción no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
            <Button onClick={handleClearHistory} variant="contained" color="error">
              Vaciar Historial
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default App; 