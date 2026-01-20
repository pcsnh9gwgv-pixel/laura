-- ============================================
-- TABLA CONTACT SUBMISSIONS - Wild Fitness
-- ============================================
-- Esta tabla almacena los formularios de contacto del sitio web

CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  service TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'archived')),
  notes TEXT
);

-- Índices para mejorar performance
CREATE INDEX idx_contact_created_at ON contact_submissions(created_at DESC);
CREATE INDEX idx_contact_status ON contact_submissions(status);
CREATE INDEX idx_contact_email ON contact_submissions(email);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- ============================================

-- Policy 1: Permitir inserts públicos (cualquiera puede enviar el formulario)
CREATE POLICY "Allow public inserts" ON contact_submissions
  FOR INSERT 
  WITH CHECK (true);

-- Policy 2: Solo admins autenticados pueden leer todos los registros
CREATE POLICY "Allow admin read all" ON contact_submissions
  FOR SELECT 
  USING (
    auth.jwt() ->> 'email' IN ('laura@wild-fitness.com', 'info@wild-fitness.com')
  );

-- Policy 3: Solo admins pueden actualizar registros (status, notes)
CREATE POLICY "Allow admin updates" ON contact_submissions
  FOR UPDATE
  USING (
    auth.jwt() ->> 'email' IN ('laura@wild-fitness.com', 'info@wild-fitness.com')
  );

-- Policy 4: Solo admins pueden eliminar registros
CREATE POLICY "Allow admin deletes" ON contact_submissions
  FOR DELETE
  USING (
    auth.jwt() ->> 'email' IN ('laura@wild-fitness.com', 'info@wild-fitness.com')
  );

-- ============================================
-- COMENTARIOS Y DOCUMENTACIÓN
-- ============================================

COMMENT ON TABLE contact_submissions IS 'Almacena los formularios de contacto del sitio web Wild Fitness';
COMMENT ON COLUMN contact_submissions.id IS 'ID único del submission';
COMMENT ON COLUMN contact_submissions.name IS 'Nombre completo del contacto';
COMMENT ON COLUMN contact_submissions.email IS 'Email del contacto';
COMMENT ON COLUMN contact_submissions.phone IS 'Teléfono del contacto (opcional)';
COMMENT ON COLUMN contact_submissions.location IS 'Ubicación preferida (Barcelona/Girona/Online/Altre)';
COMMENT ON COLUMN contact_submissions.service IS 'Servicio de interés (Trail/Força/Trekking/Online/Mixte)';
COMMENT ON COLUMN contact_submissions.message IS 'Mensaje del contacto con sus objetivos';
COMMENT ON COLUMN contact_submissions.created_at IS 'Fecha y hora de creación';
COMMENT ON COLUMN contact_submissions.status IS 'Estado del contacto: new/contacted/converted/archived';
COMMENT ON COLUMN contact_submissions.notes IS 'Notas internas del admin sobre este contacto';

-- ============================================
-- FUNCIÓN PARA NOTIFICACIONES (OPCIONAL)
-- ============================================
-- Esta función puede usarse para enviar notificaciones cuando se recibe un nuevo contacto

CREATE OR REPLACE FUNCTION notify_new_contact()
RETURNS TRIGGER AS $$
BEGIN
  -- Aquí puedes agregar lógica para enviar emails o notificaciones
  -- Por ejemplo, usando pg_notify o integraciones con servicios externos
  PERFORM pg_notify('new_contact', json_build_object(
    'id', NEW.id,
    'name', NEW.name,
    'email', NEW.email,
    'created_at', NEW.created_at
  )::text);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para ejecutar la función después de insertar
CREATE TRIGGER on_new_contact
  AFTER INSERT ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_contact();

-- ============================================
-- VISTA PARA ADMIN DASHBOARD (OPCIONAL)
-- ============================================
-- Vista simplificada para mostrar en el admin dashboard

CREATE OR REPLACE VIEW contact_submissions_summary AS
SELECT 
  id,
  name,
  email,
  phone,
  location,
  service,
  LEFT(message, 100) || CASE WHEN LENGTH(message) > 100 THEN '...' ELSE '' END as message_preview,
  status,
  created_at,
  CASE 
    WHEN created_at > NOW() - INTERVAL '24 hours' THEN 'new'
    WHEN created_at > NOW() - INTERVAL '7 days' THEN 'recent'
    ELSE 'old'
  END as age_category
FROM contact_submissions
ORDER BY created_at DESC;

-- ============================================
-- INSTRUCCIONES DE USO
-- ============================================
/*
PASO 1: Ejecutar este SQL en Supabase SQL Editor
  1. Ve a tu proyecto en Supabase
  2. SQL Editor (menú lateral izquierdo)
  3. New Query
  4. Copia y pega este SQL completo
  5. Run (Ctrl+Enter)

PASO 2: Verificar que se creó correctamente
  SELECT * FROM contact_submissions LIMIT 1;

PASO 3: Probar insert público (simula el formulario)
  INSERT INTO contact_submissions (name, email, phone, location, service, message)
  VALUES ('Test User', 'test@example.com', '640915772', 'barcelona', 'trail', 'Test message');

PASO 4: Verificar en admin dashboard
  Ve a admin.html y deberías ver el nuevo contacto en la lista

PASO 5 (OPCIONAL): Configurar notificaciones por email
  - Usa Supabase Edge Functions o webhooks
  - Configura Resend o SendGrid para enviar emails
  - Actualiza la función notify_new_contact() con tu lógica

COLUMNAS DISPONIBLES:
  - id: UUID único
  - name: Nombre completo
  - email: Email del contacto
  - phone: Teléfono (opcional)
  - location: Barcelona/Girona/Online/Altre
  - service: Trail/Força/Trekking/Online/Mixte
  - message: Mensaje con objetivos
  - created_at: Fecha de creación
  - status: new/contacted/converted/archived
  - notes: Notas internas del admin

SEGURIDAD:
  ✅ RLS habilitado
  ✅ Inserts públicos permitidos (formulario web)
  ✅ Solo admins pueden leer/actualizar/eliminar
  ✅ Emails admin: laura@wild-fitness.com, info@wild-fitness.com
*/
