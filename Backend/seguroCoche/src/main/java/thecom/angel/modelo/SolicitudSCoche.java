package thecom.angel.modelo;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record SolicitudSCoche(
    @NotNull @Min(value = 1, message = "La edad debe ser mayor que 0")
    Integer edadConductor,

    @NotNull @Min(value = 0, message = "La antigüedad no puede ser negativa")
    Integer antiguedadCarnet,

    @NotNull @Positive(message = "El valor del vehículo debe ser mayor que 0")
    Double valorVehiculo,

    @NotNull(message = "El tipo de cobertura es obligatorio")
    TipoCobertura tipoCobertura,

    Boolean tieneGaraje
) {}
