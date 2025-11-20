package br.com.restaurante.gestao_restaurante.controller;

import br.com.restaurante.gestao_restaurante.dto.auth.AuthRequestDTO;
//import br.com.restaurante.gestao_restaurante.dto.auth.AuthResponseDTO;
import br.com.restaurante.gestao_restaurante.models.*;
import br.com.restaurante.gestao_restaurante.repositories.UsuarioRepository;
import br.com.restaurante.gestao_restaurante.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthRequestDTO authRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.getEmail(), 
                            authRequest.getSenha()
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(401).body(
                Map.of("message", "E-mail ou senha incorretos")
            );
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails);

        Usuario usuario = usuarioRepository.findByEmail(authRequest.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("user", montarDadosUsuario(usuario));

        return ResponseEntity.ok(response);
    }

    //monta o objeto com os dados do usuario de acordo com seu tipo
    private Map<String, Object> montarDadosUsuario(Usuario usuario) {
        Map<String, Object> userData = new HashMap<>();
        
        userData.put("id", usuario.getId());
        userData.put("nome", usuario.getNome());
        userData.put("email", usuario.getEmail());
        userData.put("cpf", usuario.getCpf());
        userData.put("tipoUsuario", usuario.getTipoUsuario());

        if (usuario instanceof Funcionario) {
            Funcionario funcionario = (Funcionario) usuario;
            userData.put("matricula", funcionario.getMatricula());
            userData.put("dataAdmissao", funcionario.getDataAdmissao());
            userData.put("salario", funcionario.getSalario());

            if (funcionario instanceof Garcom) {
                Garcom garcom = (Garcom) funcionario;
                userData.put("bonus", garcom.getBonus());
            }

            if (funcionario instanceof Cozinheiro) {
                Cozinheiro cozinheiro = (Cozinheiro) funcionario;
                userData.put("status", cozinheiro.getStatus());
            }

            if (funcionario instanceof Admin) {
                Admin admin = (Admin) funcionario;
                userData.put("nivelAcesso", admin.getNivelAcesso());
            }
        }

        return userData;
    }
}