package config;

import java.util.List;

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;
import modelo.Usuario;

/**
 * Application Lifecycle Listener implementation class EscuchaContexto
 *
 */
@WebListener
public class EscuchaContexto implements ServletContextListener {

    /**
     * Default constructor. 
     */
    public EscuchaContexto() {
        // TODO Auto-generated constructor stub
    }

	/**
     * @see ServletContextListener#contextInitialized(ServletContextEvent)
     */
    public void contextInitialized(ServletContextEvent sce)  { 
         // TODO Auto-generated method stub
    		Usuario usuario1 = new Usuario("JAVI", "javi");
    		Usuario usuario2 = new Usuario("JAVI", "javi");
    		Usuario usuario3 = new Usuario("JAVI", "javi");
    		Usuario usuario4 = new Usuario("JAVI", "javi");
    		Usuario usuario5 = new Usuario("JAVI", "javi");
    		List<Usuario> listaUsuarios = List.of(usuario1, usuario2, usuario3, usuario4, usuario5);
    		
    		ServletContext context = sce.getServletContext();
    		context.setAttribute("listaUsuarios",listaUsuarios);
    
    }

	/**
     * @see ServletContextListener#contextDestroyed(ServletContextEvent)
     */
    public void contextDestroyed(ServletContextEvent sce)  { 
         // TODO Auto-generated method stub
    }
	
}
