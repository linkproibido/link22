import React, { useState } from 'react';
import { X, Crown, Check, Copy, MessageCircle, Upload } from 'lucide-react';
import { useUserPlan } from '../hooks/useUserPlan';

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PlanModal({ isOpen, onClose }: PlanModalProps) {
  const { userPlan, createPlanRequest } = useUserPlan();
  const [paymentProofUrl, setPaymentProofUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const pixKey = 'd3cbb30a-5a7f-46b8-b922-e44c8f9c4a25';
  const whatsappNumber = '5511937587626';
  const whatsappMessage = 'Olá! Acabei de fazer o pagamento do plano premium do Vazadinhas. Segue o comprovante.';

  if (!isOpen) return null;

  const copyPixKey = () => {
    navigator.clipboard.writeText(pixKey);
  };

  const openWhatsApp = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createPlanRequest(paymentProofUrl);
      setSuccess(true);
      setPaymentProofUrl('');
    } catch (error) {
      alert('Erro ao enviar comprovante: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setPaymentProofUrl('');
    onClose();
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="p-6 text-center">
            <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-black mb-2">Solicitação Enviada!</h2>
            <p className="text-gray-600 mb-6">
              Sua solicitação de plano premium foi enviada com sucesso. 
              Analisaremos seu pagamento e ativaremos seu plano em até 24 horas.
            </p>
            <button
              onClick={handleClose}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Crown className="h-6 w-6 text-yellow-600" />
            <h2 className="text-xl font-bold text-black">Plano Premium</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-black transition-colors p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Plan Benefits */}
          <div className="bg-gradient-to-r from-red-50 to-yellow-50 p-6 rounded-lg mb-6">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-red-600 mb-1">R$ 20,00</div>
              <div className="text-gray-600">por mês</div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-600" />
                <span>Acesso a todos os doramas e filmes</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-600" />
                <span>Sem anúncios</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-600" />
                <span>Qualidade HD</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-600" />
                <span>30 dias de acesso completo</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-600" />
                <span>Novos conteúdos semanalmente</span>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-black mb-3">Como ativar seu plano:</h3>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-black mb-2">1. Faça o pagamento via Pix</h4>
                  <div className="flex items-center space-x-2 bg-white p-3 rounded border">
                    <code className="flex-1 text-sm font-mono">{pixKey}</code>
                    <button
                      onClick={copyPixKey}
                      className="text-red-600 hover:text-red-700 p-1"
                      title="Copiar chave Pix"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-black mb-2">2. Envie o comprovante</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Após o pagamento, envie o comprovante pelo WhatsApp ou cole o link da imagem abaixo:
                  </p>
                  
                  <button
                    onClick={openWhatsApp}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 mb-4 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Enviar pelo WhatsApp</span>
                  </button>

                  <div className="text-center text-gray-500 text-sm mb-4">ou</div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Link do comprovante (opcional)
                      </label>
                      <input
                        type="url"
                        value={paymentProofUrl}
                        onChange={(e) => setPaymentProofUrl(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="https://exemplo.com/comprovante.jpg"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Cole o link da imagem do comprovante (Google Drive, Imgur, etc.)
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !paymentProofUrl.trim()}
                      className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-2 rounded-md transition-colors flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          <span>Enviar Comprovante</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-black mb-2">3. Aguarde a ativação</h4>
                  <p className="text-sm text-gray-600">
                    Analisaremos seu pagamento e ativaremos seu plano premium em até 24 horas.
                    Você receberá acesso imediato a todo o conteúdo!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Current Plan Status */}
          {userPlan && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-black mb-2">Status do seu plano:</h4>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  userPlan.status === 'active' ? 'bg-green-500' : 
                  userPlan.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm">
                  {userPlan.status === 'active' && 'Plano ativo'}
                  {userPlan.status === 'pending' && 'Aguardando aprovação'}
                  {userPlan.status === 'expired' && 'Plano expirado'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}