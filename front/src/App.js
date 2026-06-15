import Menu from './componentes/Menu';
import PaginaReceitaLista from './componentes/PaginaReceitaLista';
import PaginaReceitaCadastro from './componentes/PaginaReceitaCadastro';
import PaginaReceitaDetalhe from './componentes/PaginaReceitaDetalhe';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PaginaLogin from './componentes/PaginaLogin';
import PaginaSegura from './componentes/PaginaSegura';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
    <Menu />

   <Routes>
   <Route path='/' element={<PaginaSegura> <PaginaReceitaLista /> </PaginaSegura>} />
   <Route path='/receita' element={<PaginaSegura> <PaginaReceitaCadastro /> </PaginaSegura>} />
   <Route path='/receita/:id' element={<PaginaSegura> <PaginaReceitaDetalhe /> </PaginaSegura>} />

   <Route path='/login' element={<PaginaLogin />} />
   </Routes>

    </BrowserRouter>

    </div>
  );
}

export default App;
