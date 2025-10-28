package br.com.restaurante.gestao_restaurante.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import br.com.restaurante.gestao_restaurante.models.Usuario;
import br.com.restaurante.gestao_restaurante.repositories.UsuarioRepository;
import br.com.restaurante.gestao_restaurante.security.UserDetailsImpl;

@Service
public class UserDetailsServiceImpl implements UserDetailsService{

    @Autowired
    UsuarioRepository usuarioRepository;
    
   public UserDetailsServiceImpl(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

   @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario não encontrado com o email:" + email));
            return new UserDetailsImpl(usuario);
    }
    
    
}
