package listener;


import java.util.ArrayList;

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;
import servlets.ImcRespuestaNueva;

/**
 * Application Lifecycle Listener implementation class ContextoInicioYFin
 *
 */
@WebListener
public class ContextoInicioYFin implements ServletContextListener {

	/**
	 * Default constructor.
	 */
	public ContextoInicioYFin() {
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see ServletContextListener#contextInitialized(ServletContextEvent)
	 */
	public void contextInitialized(ServletContextEvent sce) {
		// TODO Auto-generated method stub
		System.out.println("APP INICIADA :)");
		//este objeto se crea al iniciar la app y es un bolso grande, 
		//donde puedo guardar información útil y usarla a lo largo de toda
		//la app
		ServletContext servletContext = sce.getServletContext();
		//con "numero_veces" quiero llevar la cuenta de cuántas veces llaman a CalculoIMC
		servletContext.setAttribute("numero_veces", 0);
		ArrayList<ImcRespuestaNueva> listaIMC = new ArrayList<>();
		servletContext.setAttribute("listaIMC", listaIMC);
		
	}

	/**
	 * @see ServletContextListener#contextDestroyed(ServletContextEvent)
	 */
	public void contextDestroyed(ServletContextEvent sce) {
		// TODO Haced un sysout con el número de veces que se ha invocado el CalculoIMC
		System.out.println("APP FINALIZADA");
		ServletContext servletContext = sce.getServletContext();
		int nveces = (int) servletContext.getAttribute("numero_veces");
		System.out.println("El servlet CalculoIMC se ha llamado " + nveces +" veces");
		ArrayList<ImcRespuestaNueva> listaIMC = (ArrayList<ImcRespuestaNueva>) servletContext.getAttribute("listaIMC");
	//for tradicional
		System.out.println("Con For tradicional");
		for (int i = 0; i < listaIMC.size(); i++) {
			ImcRespuestaNueva imc = listaIMC.get(i);
			System.out.println(imc);
			
		}
		
		//for each
		System.out.println("Con For each");
		for (ImcRespuestaNueva imc:listaIMC)
		{
			System.out.println(imc);
		}
	
	}

}
