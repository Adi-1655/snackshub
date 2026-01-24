import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const BackButton = ({ to = -1, label = 'Back', className = '' }) => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(to)}
            className={`flex items-center gap-2 text-[#a1a1a6] hover:text-[#FACC15] transition-colors font-medium mb-6 ${className}`}
        >
            <FiArrowLeft size={20} />
            <span>{label}</span>
        </button>
    );
};

export default BackButton;
