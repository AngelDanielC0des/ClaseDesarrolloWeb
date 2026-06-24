package appweb.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/ServletDni")
public class ServletDni extends HttpServlet {
	private static final long serialVersionUID = 1L;

	public ServletDni() {
		super();
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		String tipoDni = request.getParameter("tipoDocumento");
		String numeroDni = request.getParameter("numeroDni");

		response.setContentType("text/plain;charset=UTF-8");

		// Validar que el parámetro no venga vacío
		if (numeroDni == null || numeroDni.trim().isEmpty()) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().append("Se esperaba un parámetro numeroDni");
			return; // Terminamos la ejecución aquí
		}

		// CORRECCIÓN: Separamos la lógica usando .equals()
		if ("Nie".equals(tipoDni)) {
			try {
				// Suponemos que el input es completo, ej: "Y1234567"
				char prefijo = Character.toUpperCase(numeroDni.charAt(0));
				int numero = Integer.parseInt(numeroDni.substring(1));

				// Instanciamos y asignamos los valores requeridos por la clase Nie
				Nie nie = new Nie();
				nie.prefijo = prefijo;
				nie.numero = numero;

				char letraCalculada = nie.calcularLetra();
				response.getWriter().append("Su NIE con letra es: " + numeroDni.toUpperCase() + "-" + letraCalculada);

			} catch (Exception e) {
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				response.getWriter().append("Formato de NIE incorrecto. Debe ser una letra seguida de números (Ej: Y1234567).");
			}
		} else {
			// Caso por defecto: DNI tradicional
			try {
				int numeroDniparseado = Integer.parseInt(numeroDni);
				
				// Aprovechamos la propia clase Dni que ya calcula la letra en su lógica
				Dni dni = new Dni(numeroDniparseado);
				response.getWriter().append("Su DNI con letra es: " + numeroDniparseado + "-" + dni.calcularLetra());

			} catch (NumberFormatException e) {
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				response.getWriter().append("No ha introducido un número de DNI válido.");
			}
		}
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doGet(request, response);
	}
}