/*
  # Criação da tabela de filmes

  1. Nova Tabela
    - `movies`
      - `id` (uuid, chave primária)
      - `title` (text, título do filme)
      - `description` (text, descrição opcional)
      - `embed_code` (text, código HTML embed do vídeo)
      - `thumbnail_url` (text, URL da imagem de capa)
      - `category` (text, categoria do filme)
      - `created_at` (timestamp, data de criação)
      - `updated_at` (timestamp, data de atualização)

  2. Segurança
    - Habilitar RLS na tabela `movies`
    - Política para leitura pública dos filmes
    - Política para administradores gerenciarem filmes
*/

-- Criar tabela de filmes
CREATE TABLE IF NOT EXISTS movies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  embed_code text NOT NULL,
  thumbnail_url text NOT NULL,
  category text NOT NULL DEFAULT 'action',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública
CREATE POLICY "Qualquer um pode visualizar filmes"
  ON movies
  FOR SELECT
  TO public
  USING (true);

-- Política para administradores autenticados gerenciarem filmes
CREATE POLICY "Usuários autenticados podem gerenciar filmes"
  ON movies
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_movies_updated_at
  BEFORE UPDATE ON movies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Inserir alguns filmes de exemplo
INSERT INTO movies (title, description, embed_code, thumbnail_url, category) VALUES
(
  'Trailer Épico de Ação',
  'Um trailer emocionante cheio de ação e aventura que vai te deixar na ponta da cadeira.',
  '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
  'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'action'
),
(
  'Comédia Hilária',
  'Uma comédia que vai fazer você rir do início ao fim com situações absurdas e personagens únicos.',
  '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
  'https://images.pexels.com/photos/7991471/pexels-photo-7991471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'comedy'
),
(
  'Drama Tocante',
  'Uma história emocionante que explora os sentimentos humanos mais profundos e complexos.',
  '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
  'https://images.pexels.com/photos/7991622/pexels-photo-7991622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'drama'
),
(
  'Terror Assombrado',
  'Prepare-se para uma experiência aterrorizante que vai te fazer pular da cadeira.',
  '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
  'https://images.pexels.com/photos/8263618/pexels-photo-8263618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'horror'
),
(
  'Ficção Científica Futurista',
  'Uma jornada épica através do espaço e tempo com tecnologia avançada e mundos inexplorados.',
  '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
  'https://images.pexels.com/photos/8728382/pexels-photo-8728382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'sci-fi'
);