import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../assets/LogoNobel.jpg';
import sello from '../assets/sello.png'

export const generarPDF = (detalleCompra) => {
  const doc = new jsPDF();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(value);
  };

  const pageWidth = doc.internal.pageSize.getWidth();

  // Logo
  doc.addImage(logo, 'PNG', 14, 10, 25, 25);

  // Título centrado
  const titulo = 'DETALLE DE COMPRA';
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  const textWidth = doc.getTextWidth(titulo);
  const xCenter = (pageWidth - textWidth) / 2;
  doc.text(titulo, xCenter, 45);

  // Línea decorativa bajo el título
  doc.setDrawColor(100, 100, 255);
  doc.setLineWidth(0.8);
  doc.line(14, 50, pageWidth - 14, 50);

  // Info de la compra
  doc.setFontSize(12);
  doc.setTextColor(60);
  let y = 60;
  const lineSpacing = 7;

  doc.text(`Comprobante: ${detalleCompra.Nro_comprobante}`, 14, y); y += lineSpacing;
  doc.text(`Método de pago: ${detalleCompra.nombre_metodoPago}`, 14, y); y += lineSpacing;
  doc.text(`Droguería: ${detalleCompra.nombre_drogueria}`, 14, y); y += lineSpacing;
  doc.text(`Teléfono: ${detalleCompra.telefono}`, 14, y); y += lineSpacing;
  doc.text(`Dirección: ${detalleCompra.direccion}`, 14, y); y += lineSpacing;
  doc.text(`Correo: ${detalleCompra.correo}`, 14, y); y += lineSpacing;
  doc.text(`CUIT: ${detalleCompra.cuit}`, 14, y); y += lineSpacing;

  // Tabla de productos
  autoTable(doc, {
    startY: y + 10,
    head: [['#', 'PRODUCTO', 'CANTIDAD', 'PRECIO UNITARIO', 'SUBTOTAL']],
    body: detalleCompra.productos.map((producto, i) => {
      const subtotal = producto.cantidad * producto.precio_costo;
      return [
        i + 1,
        producto.nombre_producto,
        producto.cantidad,
        formatCurrency(producto.precio_costo),
        formatCurrency(subtotal)
      ];
    }),
    headStyles: {
      fillColor: [255, 105, 180], 
      textColor: 255,
      halign: 'center',
      fontStyle: 'bold'
    },
    bodyStyles: {
      halign: 'center',
      textColor: 50
    },
    styles: {
      fontSize: 11,
      cellPadding: 4
    },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });

  // Total destacado
  const finalY = doc.lastAutoTable.finalY || 100;
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.setDrawColor(41, 128, 185);
  doc.setFillColor(230, 240, 255);
  doc.rect(14, finalY + 10, 180, 10, 'FD');
  doc.text(`TOTAL: ${formatCurrency(detalleCompra.total)}`, 160, finalY + 17, { align: 'right' });

  // Firma o sello (posición al pie del documento)
  doc.addImage(sello, 'PNG', 130, finalY + 40, 50, 30); // x, y, width, height

  // Texto debajo del sello (opcional)
  doc.setFontSize(10);
  doc.setTextColor(60);
  doc.text('Firma autorizada - FARMACIA NOBEL', 155, finalY + 73, { align: 'center' });

  
  // Footer
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text('Generado automáticamente - Sistema de Ventas - FARMACIA NOBEL', 14, 290);

  // Guardar PDF
  doc.save(`Combrobante_Compra:${detalleCompra.Nro_comprobante}.pdf`);
}
