package br.com.restaurante.gestao_restaurante.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import br.com.restaurante.gestao_restaurante.models.Admin;
import br.com.restaurante.gestao_restaurante.repositories.AdminRepository;
import br.com.restaurante.gestao_restaurante.repositories.UsuarioRepository;

@Configuration
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${initial.admin.email}")
    private String adminEmail;

    @Value("${initial.admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {
        if (usuarioRepository.findByEmail(adminEmail).isEmpty()) {
            Admin admin = new Admin();
            admin.setNome("Admin");
            admin.setEmail(adminEmail);
            admin.setSenha(passwordEncoder.encode(adminPassword));
            admin.setCpf("000.000.000-00");
            admin.setMatricula("ADMIN001");
            admin.setTipoUsuario("ADMIN");
            admin.setNivelAcesso(1);
            admin.setDataAdmissao(java.time.LocalDate.now());

            adminRepository.save(admin);
            System.out.println("Admin user created: " + adminEmail);
        } else {
            System.out.println("Admin user already exists.");
        }
    }
}
