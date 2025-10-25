import { useState } from 'react';
import { Link } from 'react-router-dom';
import { routesConfig } from '../../pages';

const IconWithLabel = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <div className="flex flex-row items-center gap-2">
    {icon}
    <span>{label}</span>
  </div>
);

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`bg-white shadow-lg transition-all duration-300 ease-in-out ${
        isOpen ? 'w-156' : 'w-20'
      } flex flex-row items-center py-10 flex-col`}
    >
      {/* Botão de abrir/fechar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mb-8 p-2 rounded-lg hover:bg-red-200 transition-colors"
      >
        {isOpen ? '←' : '→'}
      </button>

      {/* Navegação */}
      <nav className="flex flex-col gap-5 w-full items-center">
        {routesConfig.map((route) => (
          <Link
            key={route.path}
            to={route.path}
            className="text-red-700 hover:text-blue-500 flex items-center gap-3 w-full justify-center"
          >            {isOpen ? (
              <IconWithLabel
                icon={route.icon}
                label={route.path.replace('/', '')}
              />
            ) : (
              route.icon
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
};
