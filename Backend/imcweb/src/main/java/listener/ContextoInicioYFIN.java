package listener;

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;

/**
 * Application Lifecycle Listener implementation class ContextoInicioYFIN
 *
 */
@WebListener
public class ContextoInicioYFIN implements ServletContextListener {

    /**
     * Default constructor. 
     */
    public ContextoInicioYFIN() {
        // TODO Auto-generated constructor stub
    }

	/**
     * @see ServletContextListener#contextInitialized(ServletContextEvent)
     */
    public void contextInitialized(ServletContextEvent sce)  { 
        System.out.println("APP INCIADA, INCIANDO CONTEXTO...");
        ServletContext servletContext = sce.getServletContext();
        servletContext.setAttribute("numero_veces", 0);
    }

	/**
     * @see ServletContextListener#contextDestroyed(ServletContextEvent)
     */
    public void contextDestroyed(ServletContextEvent sce)  { 
         System.out.println("APP FINALIZADA, DESTRUYENDO CONTEXTO...");
    }
	
}
