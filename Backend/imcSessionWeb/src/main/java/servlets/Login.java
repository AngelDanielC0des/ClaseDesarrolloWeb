package servlets;

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import modelo.Usuario;

import java.io.IOException;
import java.util.ArrayList;

/**
 * Servlet implementation class Login
 */
@WebServlet("/login")
public class Login extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Login() {
        super();
        // TODO Auto-generated constructor stub
    }
    
    private boolean existeUsuario (String usuario, String password)
    {
    		boolean existe = false;
    			
    			//leo el contexto, la lista y miro si este usuario está
    			ServletContext servletContext = this.getServletContext();
    			ArrayList<Usuario> listaUsuarios = (ArrayList<Usuario>) servletContext.getAttribute("listaUsuarios");
    			Usuario usuarioRecibido = new Usuario(usuario, password);
    			existe = listaUsuarios.contains(usuarioRecibido);
    		
    		return existe;
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
	
		//leer el usuario y contraseña enviados por el cliente
		String usuario = request.getParameter("usuario");
		String password = request.getParameter("password");
		
		System.out.println("El usuario es " + usuario + " y su contraseña " + password);
		
		//validar, ver si existe en mi lista de usuarios. De momento suponemos que sí
		if (existeUsuario(usuario, password)) {
			HttpSession sesion =  request.getSession();
			System.out.println("Sesión nueva creada " + sesion.getId() + " "+sesion);
			//le envío a la página del imc
			response.sendRedirect("imc.html");
		} else {
			System.out.println("El usuario No existe");
			//TODO redirigir página de error
			response.sendRedirect("error-login.html");
		}
	
	}

}
