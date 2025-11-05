package br.com.restaurante.gestao_restaurante.security;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import br.com.restaurante.gestao_restaurante.models.Usuario;
import br.com.restaurante.gestao_restaurante.repositories.UsuarioRepository;

public class UserDetailsImpl implements UserDetails{
    
    private Usuario usuario;

    private UsuarioRepository usuarioRepository;

    public UserDetailsImpl(Usuario usuario){
        this.usuario = usuario;
    }

    public Long getId(){
        return usuario.getId();
    }

    public String getNome(){
        return usuario.getNome();
    }

    public String getTipoUsuario(){
        return usuario.getTipoUsuario();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (usuario.getTipoUsuario() == null){
            return Collections.emptyList();
        }

        return Collections.singletonList(new SimpleGrantedAuthority("ROLE" + usuario.getTipoUsuario()));
    }

    @Override
    public String getPassword() {
        return usuario.getSenha();
    }

    @Override
    public String getUsername() {
        return usuario.getEmail();
    }
}
