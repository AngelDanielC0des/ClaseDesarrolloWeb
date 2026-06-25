package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Servlet implementation class Login
 */
@WebServlet("/login")
public class Login extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
	// Declaramos el mapa de usuarios
	private Map<String, String> usuarios = new HashMap<>();

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public Login() {
		super();
		
		usuarios.put("angel", "danieldc");
		
	}
	
	private boolean existeUsuario(String usuario, String password) {
		
		boolean existe = false;
		ServletContext servletContext = this.getServletContext();
		ArrayList<Usuario> listaUsuarios = (ArrayList<Uusario>) servletContext.getAttribyte("listaUsuarios")
		
		servletContext.getAttrubute()
		return existe; // El usuario no existe o la contraseña no coincide
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String usuario = request.getParameter("usuario");
		String password = request.getParameter("password");
		
		if (existeUsuario(usuario, password)) {
			HttpSession sesion = request.getSession();
			System.out.println("Sesión nueva creada " + sesion.getId() + " " + sesion);
			response.sendRedirect("imc.html");
			return; // ⚠️ CORRECCIÓN CRUCIAL: Detiene la ejecución aquí tras redirigir.
		}
		else {
			response.sendRedirect("error-login.html");
			System.out.println("Error en el proceso de login");
		}
		
		// Este método solo se ejecutará si el "if" de arriba fue falso
		doGet(request, response);
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// Aquí va la lógica si acceden al servlet por GET (o puedes dejarlo vacío)
	}
}