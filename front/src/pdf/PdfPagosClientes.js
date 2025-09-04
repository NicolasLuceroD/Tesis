import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from '../assets/LogoNobel.jpg'; 

export const PdfPagosClientes = ({ nombreCliente, telefono, monto, ordenSeleccionada }) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // --- Calculo deuda después del pago ---
    const deudaDespuesDelPago = ordenSeleccionada.faltaPagar - monto;

    // --- Logo farmacia ---
    doc.addImage(logo, 'PNG', 14, 10, 30, 30);

    // --- Info farmacia ---
    const fechaHora = new Date().toLocaleString('es-AR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
    doc.setFontSize(10);
    doc.setTextColor(40);
    doc.text("Farmacia Nobel", pageWidth - 14, 12, { align: 'right' });
    doc.text("Dirección: San Martín 102 - Lules", pageWidth - 14, 17, { align: 'right' });
    doc.text("Código Postal: CP - 4000", pageWidth - 14, 22, { align: 'right' });
    doc.text(`${fechaHora}`, pageWidth - 14, 27, { align: 'right' });

    // --- Título ---
    let yOffset = 50;
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text("COMPROBANTE DE PAGO", pageWidth / 2, yOffset, { align: "center" });

    // --- Línea decorativa ---
    doc.setDrawColor(100, 100, 255);
    doc.setLineWidth(0.8);
    doc.line(14, yOffset + 3, pageWidth - 14, yOffset + 3);

    // --- Datos cliente y pago ---
    let yDatos = yOffset + 10;
    doc.setFontSize(12);
    doc.text(`Cliente: ${nombreCliente}`, 14, yDatos + 10);
    doc.text(`Teléfono: ${telefono}`, 14, yDatos + 16);
    doc.text(`Fecha y hora del pago: ${fechaHora}`, 14, yDatos + 22);

    doc.setTextColor(0, 128, 0);
    doc.text(`Monto pagado: ${formatCurrency(monto)}`, 14, yDatos + 28);

    doc.setTextColor(255, 140, 0);
    doc.text(`Total deuda antes del pago: ${formatCurrency(ordenSeleccionada.faltaPagar)}`, 14, yDatos + 34);

    doc.setTextColor(220, 20, 60);
    doc.text(`Deuda después del pago: ${formatCurrency(deudaDespuesDelPago)}`, 14, yDatos + 40);

    // --- Tabla de productos ---
    const rows = ordenSeleccionada.productos.map(p => [
        p.nombre_producto,
        parseInt(p.cantidadVendida),
        p.tipoVenta,
        formatCurrency(p.precioAplicado),
        formatCurrency(p.precioAplicado * p.cantidadVendida)
    ]);

    autoTable(doc, {
        head: [['PRODUCTOS', 'CANTIDAD', 'PRESENTACION', 'PRECIO', 'TOTAL']],
        body: rows,
        startY: yDatos + 55,
        headStyles: { fillColor: [255, 105, 180], textColor: 255, halign: 'center', fontStyle: 'bold' },
        bodyStyles: { halign: 'center', textColor: 50 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        styles: { fontSize: 11, cellPadding: 4 }
    });

    doc.save(`Comprobante_PagoCredito_${nombreCliente}_${Date.now()}.pdf`);
};

// Función auxiliar para formatear moneda
const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
    }).format(value);
};
